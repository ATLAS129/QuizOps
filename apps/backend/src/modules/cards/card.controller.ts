import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CardService } from './card.service.js';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard.js';

@UseGuards(JwtAccessGuard)
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Patch(':id')
  async updateCard(@Param('id') cardId: string, @Body() dto: any) {
    return this.cardService.updateCard(cardId, dto);
  }

  @Delete(':id')
  async deleteCard(@Param('id') cardId: string) {
    return this.cardService.deleteCard(cardId);
  }
}
