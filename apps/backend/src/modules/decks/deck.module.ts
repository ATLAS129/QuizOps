import { Module } from '@nestjs/common';
import { DeckController } from './deck.controller.js';
import { DeckService } from './deck.service.js';
import { AiModule } from '../ai/ai.module.js';

@Module({
  imports: [AiModule],
  controllers: [DeckController],
  providers: [DeckService],
})
export class DeckModule {}
