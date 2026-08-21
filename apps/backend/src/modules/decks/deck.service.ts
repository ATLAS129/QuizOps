import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AiService } from '../ai/ai.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateDeckDto } from './dto/update-deck.dto.js';

@Injectable()
export class DeckService {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  async findOneDeck(deckId: string, userId: string) {
    const deck = await this.prisma.deck.findUnique({
      where: { id: deckId },
      include: {
        _count: {
          select: { cards: true },
        },
        completionHistory: {
          where: {
            deckId,
            userId,
          },
          orderBy: {
            completedAt: 'desc',
          },
          take: 1,
        },
      },
    });

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
        completionHistory: {
          where: {
            userId,
          },
          orderBy: {
            completedAt: 'desc',
          },
          take: 1,
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

  async getFullDeckCompletionHistory(
    deckId: string,
    userId: string,
    limit?: number,
  ) {
    const history = await this.prisma.deckCompletion.findMany({
      where: { deckId, userId },
      take: limit,
      orderBy: { completedAt: 'desc' },
    });

    if (!history) {
      throw new NotFoundException("You didn't complete this deck.");
    }
    return history;
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

  async updateDesk(deckId: string, dto: UpdateDeckDto) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        let deck = await tx.deck.findUnique({
          where: { id: deckId },
          include: {
            _count: {
              select: { cards: true },
            },
          },
        });

        if (!deck) {
          throw new NotFoundException('Deck is not found.');
        }

        if (dto.title !== undefined) {
          deck = await tx.deck.update({
            where: { id: deckId },
            data: { title: dto.title },
            include: {
              _count: {
                select: { cards: true },
              },
            },
          });
        }

        console.log('HIIIIIIIIII', dto);

        if (dto.isCompleted === true) {
          deck = await tx.deck.update({
            where: { id: deckId },
            data: { isCompleted: dto.isCompleted },
            include: {
              _count: {
                select: { cards: true },
              },
            },
          });
          await tx.deckCompletion.create({
            data: {
              deckId: deck.id,
              userId: deck.userId,
              totalQuestions: deck._count.cards,
              completedAt: dto.completedAt as Date,
              completionDuration: dto.completionDuration as number,
              correctAnswersCompleted: dto.correctAnswersCompleted as number,
            },
          });
        }

        return deck;
      });

      return result;
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteDeck(deckId: string) {
    try {
      const res = await this.prisma.deck.delete({ where: { id: deckId } });

      return res;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
