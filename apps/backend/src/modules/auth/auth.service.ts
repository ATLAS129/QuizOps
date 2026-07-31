import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SignupUserDto } from './dto/signup-user.dto.js';
import * as argon2 from 'argon2';
import { LoginUserDto } from './dto/login-user.dto.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user.service.js';

type SignTokensUser = {
  id: string;
  email: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async signup(dto: SignupUserDto) {
    const { email, name, password, repeatPassword } = dto;

    const isUserExist = await this.userService.findByEmail(email);

    if (isUserExist) {
      throw new ConflictException('User already exists.');
    }

    const isPasswordsMatch = password === repeatPassword;

    if (!isPasswordsMatch) {
      throw new UnprocessableEntityException("Passwords don't match");
    }

    const passwordHash = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    const { accessToken, refreshToken } = await this.signTokens(
      user as SignTokensUser,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      user: await this.userService.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginUserDto) {
    const { email, password } = dto;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Check credentials.');
    }

    const isPasswordsMatch = await argon2.verify(user.passwordHash, password);

    if (!isPasswordsMatch) {
      throw new UnauthorizedException('Check credentials.');
    }

    const { accessToken, refreshToken } = await this.signTokens(
      user as SignTokensUser,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      user: await this.userService.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
        refreshToken: { not: null },
      },
      data: { refreshToken: null },
    });
  }

  async refreshTokens(user: SignTokensUser) {
    const { accessToken, refreshToken } = await this.signTokens(
      user as SignTokensUser,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    try {
      const refreshTokenHash = await argon2.hash(refreshToken);
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: refreshTokenHash },
      });
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  private async signTokens(user: SignTokensUser) {
    const payload = { sub: user.id, email: user.email };
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwt.signAsync(payload, {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        }),
        this.jwt.signAsync(payload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        }),
      ]);
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
