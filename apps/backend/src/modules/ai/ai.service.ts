import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { systemPrompt } from './prompt.js';

const AiConfig = {
  systemInstruction: systemPrompt,
  temperature: 0.2,
  responseMimeType: 'application/json',
  responseSchema: {
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
        minItems: 5,
        maxItems: 10,
      },
    },
    required: ['title', 'cards'],
    additionalProperties: false,
  },
};

@Injectable()
export class AiService {
  private ai: GoogleGenAI;
  private model: string;

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.getOrThrow('GEMINI_API_KEY') as string,
    });
    this.model = this.configService.get<string>(
      'GEMINI_MODEL',
      'gemini-3.1-flash-lite',
    );
  }

  async generateCards(
    pdf?: Express.Multer.File,
    prompt?: string,
    url?: string,
  ) {
    const contents: any = [];

    if (pdf) {
      const base64Pdf = pdf.buffer.toString('base64');
      contents.push({
        inlineData: {
          data: base64Pdf,
          mimeType: 'application/pdf',
        },
      });
    }
    if (url) {
      contents.push(`URL: ${url}\n\n ${prompt || ''}`);
    } else if (prompt) {
      contents.push(prompt);
    }

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents,
      config: AiConfig,
    });

    if (!response) {
      throw new InternalServerErrorException('Something went wrong with AI.');
    }

    const result = await response.text;
    const text = JSON.parse(result as string);
    return text;
  }
}
