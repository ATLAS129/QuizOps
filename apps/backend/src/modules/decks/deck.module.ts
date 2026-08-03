import { Module } from '@nestjs/common';
import { DeckController } from './deck.controller.js';
import { DeckService } from './deck.service.js';
import { AiModule } from '../ai/ai.module.js';
import { CardModule } from '../cards/card.module.js';

@Module({
  imports: [AiModule, CardModule],
  controllers: [DeckController],
  providers: [DeckService],
})
export class DeckModule {}
