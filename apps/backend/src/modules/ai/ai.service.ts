import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { systemPrompt } from './prompt.js';

const AiConfig = {
  systemInstruction: systemPrompt,
  temperature: 0.2,
  responseMimeType: 'application/json',
  responseSchema: {
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
    },
    minItems: 5,
    maxItems: 10,
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

  async generateCardsFromPdf(pdf: Express.Multer.File, prompt?: string) {
    const base64Pdf = pdf.buffer.toString('base64');

    const contents: any = [
      {
        inlineData: {
          data: base64Pdf,
          mimeType: 'application/pdf',
        },
      },
    ];

    if (prompt) contents.push(prompt);

    try {
      const cards = await this.generateCards(contents);

      return cards;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async generateCardsFromText(userText: string) {
    try {
      const cards = await this.generateCards(userText);

      return cards;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async generateCardsFromUrl(url: string, prompt?: string) {
    const contents = `URL: ${url}\n\n ${prompt ?? ''}`;

    try {
      const cards = await this.generateCards(contents);
      return cards;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async generateCards(contents: any) {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents,
      config: AiConfig,
    });

    if (!response) {
      throw new InternalServerErrorException('Something went wrong.');
    }

    const result = await response.text;
    const text = JSON.parse(result as string);
    return text;
  }
}
