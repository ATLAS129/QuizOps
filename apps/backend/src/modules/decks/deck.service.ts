import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto.js';
import { AiService } from '../ai/ai.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DeckService {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  async findOneDeck(deckId: string) {
    try {
      const deck = await this.prisma.deck.findUnique({ where: { id: deckId } });

      if (!deck) {
        throw new NotFoundException('Deck is not found.');
      }

      return deck;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async findAllDecks(userId: string) {
    try {
      const decks = await this.prisma.deck.findMany({ where: { userId } });

      if (!decks) {
        throw new NotFoundException('Decks are not found.');
      }

      return decks;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async createDeckWithText(userId: string, dto: CreateDeckDto) {
    try {
      const AiResponse = await this.aiService.generateCardsFromText(dto.prompt);

      const deck = await this.createDeck(userId, dto.title, AiResponse);

      return deck;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async createDeckWithPdf(
    userId: string,
    pdf: Express.Multer.File,
    dto: { title: string; prompt?: string },
  ) {
    try {
      const AiResponse = await this.aiService.generateCardsFromPdf(
        pdf,
        dto.prompt,
      );

      const deck = await this.createDeck(userId, dto.title, AiResponse);

      return deck;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async createDeck(userId, title, data) {
    const deck = await this.prisma.deck.create({
      data: {
        title: title,
        user: {
          connect: {
            id: userId,
          },
        },
        cards: {
          createMany: {
            data,
          },
        },
      },
    });

    return deck;
  }
}
