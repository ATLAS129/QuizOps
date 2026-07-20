import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { User } from '../../../prisma/generated/prisma/client.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User is not found');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async sanitizeUser(user: User) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
