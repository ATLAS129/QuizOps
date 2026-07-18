import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CardService } from './card.service.js';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard.js';

@UseGuards(JwtAccessGuard)
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get(':id')
  async getCardsFromDeck(@Param('id') deckId: string) {
    return this.cardService.getCardsFromDeck(deckId);
  }
}
