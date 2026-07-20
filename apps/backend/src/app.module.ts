import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './modules/ai/ai.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { DeckModule } from './modules/decks/deck.module.js';
import { CardModule } from './modules/cards/card.module.js';
import { UserModule } from './modules/users/user.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AiModule,
    AuthModule,
    DeckModule,
    CardModule,
    UserModule,
  ],
})
export class AppModule {}
