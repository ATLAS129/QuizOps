import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AiService } from '../ai/ai.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DeckService {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  async findOneDeck(deckId: string) {
    const deck = await this.prisma.deck.findUnique({ where: { id: deckId } });

    if (!deck) {
      throw new NotFoundException('Deck is not found.');
    }

    return deck;
  }

  async findAllDecks(userId: string, limit?: number) {
    const decks = await this.prisma.deck.findMany({
      where: { userId },
      include: {
        _count: {
          select: { cards: true },
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    if (!decks) {
      throw new NotFoundException('Decks are not found.');
    }

    return decks;
  }

  async createDeck(userId, title, pdf?, prompt?, url?) {
    try {
      const AIResponse = await this.aiService.generateCards(pdf, prompt, url);

      const deck = await this.prisma.deck.create({
        data: {
          title: title ? title : AIResponse.title,
          user: {
            connect: {
              id: userId,
            },
          },
          cards: {
            createMany: {
              data: AIResponse.cards,
            },
          },
        },
      });

      return AIResponse;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
