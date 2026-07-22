import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { User } from '../../../prisma/generated/prisma/client.js';
import { type UpdateUserDto } from './dto/update-user.dto.js';

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

  async updateMe(userId: string, dto: UpdateUserDto) {
    if (!dto.email && !dto.name) {
      throw new BadRequestException('Atleast one property must be updated');
    }
    try {
      // make checking if dto's data doesn't match current data

      const newUser = await this.prisma.user.update({
        where: { id: userId },
        data: dto,
      });

      return this.sanitizeUser(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async sanitizeUser(user: User) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
