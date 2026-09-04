import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DeckService } from './deck.service.js';
import { type CreateDeckDto } from './dto/create-deck.dto.js';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CardService } from '../cards/card.service.js';
import { type UpdateDeckDto } from './dto/update-deck.dto.js';

@UseGuards(JwtAccessGuard)
@Controller('decks')
export class DeckController {
  constructor(
    private readonly deckService: DeckService,
    private readonly cardService: CardService,
  ) {}

  @Get(':id')
  async getOneDeck(@Req() req: any, @Param('id') deckId: string) {
    return this.deckService.findOneDeck(deckId, req.user.id);
  }

  @Get()
  async getAllDecks(
    @Req() req: any,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.deckService.findAllDecks(req.user.id, limit);
  }

  @Get(':id/history')
  async getFullDeckCompletionHistory(
    @Req() req: any,
    @Param('id') deckId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.deckService.getFullDeckCompletionHistory(
      deckId,
      req.user.id,
      limit,
    );
  }

  @Get(':id/cards')
  async getAllCardsFromDeck(@Param('id') deckId: string) {
    return this.cardService.getCardsFromDeck(deckId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
    }),
  )
  async createDeck(
    @Req() req: any,
    @Body() dto: CreateDeckDto,
    @UploadedFile() pdf?: Express.Multer.File,
  ) {
    const extraOptions =
      typeof dto.extraOptions === 'string'
        ? JSON.parse(dto.extraOptions)
        : dto.extraOptions;

    return this.deckService.createDeck(
      req.user.id,
      dto.title,
      pdf,
      dto?.prompt,
      dto?.url,
      dto?.difficulty,
      dto?.numberOfQuestions,
      dto?.questionType,
      extraOptions,
    );
  }

  @Patch(':id')
  async updateDesk(@Param('id') deckId: string, @Body() dto: UpdateDeckDto) {
    return this.deckService.updateDesk(deckId, dto);
  }

  @Delete(':id')
  async deleteDesk(@Param('id') deckId: string) {
    return this.deckService.deleteDeck(deckId);
  }
}
