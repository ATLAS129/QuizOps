import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard.js';

@UseGuards(JwtAccessGuard)
@Controller('users')
export class UserController {
  @Get('me')
  async getMe(@Req() req: any) {
    return req.user;
  }
}
