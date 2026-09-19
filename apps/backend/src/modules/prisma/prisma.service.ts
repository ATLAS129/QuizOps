import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../prisma/generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: (process.env.NODE_ENV == 'production'
        ? process.env.DIRECT_URL
        : process.env.DATABASE_URL) as string,
    });
    super({ adapter });
  }
}
