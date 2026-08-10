import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async getCardsFromDeck(deckId: string) {
    const cards = await this.prisma.card.findMany({ where: { deckId } });
    const count = await this.prisma.card.count({ where: { deckId } });

    if (!cards) {
      throw new NotFoundException('Cards are not found.');
    }

    return { cards: cards, count: count };
  }

  async updateCard(cardId: string, dto: any) {
    return this.prisma.card.update({ where: { id: cardId }, data: dto });
  }

  async deleteCard(cardId: string) {
    return this.prisma.card.delete({ where: { id: cardId } });
  }
}
