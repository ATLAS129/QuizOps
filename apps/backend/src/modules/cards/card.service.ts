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

    if (!cards) {
      throw new NotFoundException('Cards are not found.');
    }

    return cards;
  }
}
