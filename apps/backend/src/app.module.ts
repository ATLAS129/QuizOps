import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './modules/ai/ai.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { JwtModule } from '@nestjs/jwt';
import { DeckModule } from './modules/decks/deck.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AiModule,
    AuthModule,
    DeckModule,
  ],
})
export class AppModule {}
