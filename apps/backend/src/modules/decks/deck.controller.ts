import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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

@UseGuards(JwtAccessGuard)
@Controller('decks')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @Get(':id')
  async getOneDeck(@Param('id') deckId: string) {
    return this.deckService.findOneDeck(deckId);
  }

  @Get()
  async getAllDecks(
    @Req() req: any,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.deckService.findAllDecks(req.user.id, limit);
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
    return this.deckService.createDeck(
      req.user.id,
      dto.title,
      pdf,
      dto?.prompt,
      dto?.url,
    );
  }
}
