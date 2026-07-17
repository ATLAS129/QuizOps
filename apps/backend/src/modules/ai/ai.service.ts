import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { systemPrompt } from './prompt.js';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get('GEMINI_API_KEY') as string,
    });
  }

  async generateDeckFromText(userText: string) {
    try {
      const response = await this.ai.models.generateContent({
        model:
          this.configService.get<string>('GEMINI_MODEL') ||
          'gemini-3.1-flash-lite',
        contents: userText,
        config: {
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
        },
      });

      const result = await response.text;
      const text = JSON.parse(result as string);
      return text;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong.');
    }
  }
}
