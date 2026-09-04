import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import z from 'zod';
import { systemPrompt } from './prompt.js';

const createResponseSchema = (questionCount: number) => ({
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    cards: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          question: { type: 'STRING' },
          answer: { type: 'STRING' },
          options: {
            type: 'ARRAY',
            items: { type: 'STRING' },
          },
          explanation: { type: 'STRING' },
        },
        required: ['question', 'answer', 'options', 'explanation'],
        additionalProperties: false,
      },
      minItems: questionCount,
      maxItems: questionCount,
    },
  },
  required: ['title', 'cards'],
  additionalProperties: false,
});

const AiConfig = z.object({
  title: z.string(),
  cards: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      options: z.array(z.string()).optional(),
      explanation: z.string().optional(),
    }),
  ),
});

@Injectable()
export class AiService {
  private ai: GoogleGenAI;
  private model: string;

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.getOrThrow('GEMINI_API_KEY'),
    });
    this.model = this.configService.get<string>(
      'GEMINI_MODEL',
      'gemini-3.1-flash-lite',
    );
  }

  async generateCards(
    pdf: Express.Multer.File,
    prompt: string,
    url: string,
    options: {
      numberOfQuestions: '5' | '10' | '15' | '20';
      questionType: 'Mixed' | 'Multiple choice' | 'True / False';
      difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
      extraOptions: string[] | undefined;
    },
  ) {
    type InputContent =
      { inlineData: { data: string; mimeType: 'application/pdf' } } | string;

    const content: InputContent[] = [];
    const tools: Array<{ urlContext: object }> = [];

    if (pdf) {
      content.push({
        inlineData: {
          data: pdf.buffer.toString('base64'),
          mimeType: 'application/pdf',
        },
      });
    }

    if (url) {
      content.push(`URL: ${url}`);
      tools.push({ urlContext: {} });
    }

    if (prompt) {
      content.push(prompt);
    }

    let response: GenerateContentResponse;
    const questionCount = Number(options.numberOfQuestions);
    try {
      response = await this.ai.models.generateContent({
        model: this.model,
        contents: content,
        config: {
          systemInstruction: systemPrompt(options),
          responseMimeType: 'application/json',
          responseSchema: createResponseSchema(questionCount),
          tools: url ? tools : undefined,
        },
      });
    } catch (error: unknown) {
      const status =
        typeof error === 'object' && error !== null && 'status' in error
          ? error.status
          : undefined;

      if (status === 429) {
        throw new HttpException(
          'Gemini API quota exceeded. Check your Gemini API plan and billing details.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw error;
    }

    if (!response) {
      throw new InternalServerErrorException('Something went wrong with AI.');
    }

    const outputText = response.text;
    if (typeof outputText !== 'string') {
      throw new InternalServerErrorException('AI returned an empty response.');
    }

    const result = AiConfig.parse(JSON.parse(outputText));
    if (result.cards.length !== questionCount) {
      throw new InternalServerErrorException(
        `AI generated ${result.cards.length} questions instead of ${questionCount}. Please try again.`,
      );
    }

    return {
      ...result,
      cards: result.cards.map((card) => ({
        ...card,
        options:
          card.options && card.options.length > 0
            ? card.options
            : card.answer === 'True' || card.answer === 'False'
              ? ['True', 'False']
              : [],
        explanation: card.explanation ?? '',
      })),
    };
  }
}
