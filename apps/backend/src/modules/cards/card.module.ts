import { Module } from '@nestjs/common';
import { CardService } from './card.service.js';
import { CardController } from './card.controller.js';

@Module({
  providers: [CardService],
  controllers: [CardController],
})
export class CardModule {}
