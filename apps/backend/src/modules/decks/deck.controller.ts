import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeckService } from './deck.service.js';
import { type CreateDeckDto } from './dto/create-deck.dto.js';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard.js';

@UseGuards(JwtAccessGuard)
@Controller('decks')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @Get(':id')
  async getOneDeck(@Param('id') deckId: string) {
    return this.deckService.findOneDeck(deckId);
  }

  @Get()
  async getAllDecks(@Req() req: any) {
    return this.deckService.findAllDecks(req.user.id);
  }

  @Post()
  async createDeck(@Req() req: any, @Body() dto: CreateDeckDto) {
    return this.deckService.createDeck(req.user.id, dto);
  }
}
