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
import {
  type CreateDeckWithUrlDto,
  type CreateDeckWithPdfDto,
  type CreateDeckWithTextDto,
} from './dto/create-deck.dto.js';
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

  @Post('text')
  async createDeckWithText(
    @Req() req: any,
    @Body() dto: CreateDeckWithTextDto,
  ) {
    return this.deckService.createDeckWithText(req.user.id, dto);
  }

  @Post('url')
  async createDeckWithUrl(@Req() req: any, @Body() dto: CreateDeckWithUrlDto) {
    return this.deckService.createDeckWithUrl(req.user.id, dto);
  }

  @Post('pdf')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
    }),
  )
  async createDeckWithPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDeckWithPdfDto,
    @Req() req: any,
  ) {
    return this.deckService.createDeckWithPdf(req.user.id, file, dto);
  }
}
