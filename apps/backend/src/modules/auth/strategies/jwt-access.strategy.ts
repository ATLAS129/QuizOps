import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from '../../users/user.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.['access_token'] ?? null,
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.userService.findById(payload.sub);

    if (!user) throw new UnauthorizedException();

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
