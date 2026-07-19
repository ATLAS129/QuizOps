import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { type SignupUserDto } from './dto/signup-user.dto.js';
import { type LoginUserDto } from './dto/login-user.dto.js';
import { type Response } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard.js';
import { JwtAccessGuard } from './guards/jwt-access.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() signupDto: SignupUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.signup(signupDto);

    this.setCookies(res, accessToken, refreshToken);

    return user;
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(loginDto);

    this.setCookies(res, accessToken, refreshToken);

    return user;
  }

  @UseGuards(JwtAccessGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.id);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Loggged out successfully' };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      req.user,
    );

    this.setCookies(res, accessToken, refreshToken);

    return { message: 'Tokens refreshed successfully' };
  }

  private setCookies(
    res: Response,
    access_token: string,
    refresh_token: string,
  ) {
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
}
