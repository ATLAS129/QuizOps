import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
})
export class AppModule {}
