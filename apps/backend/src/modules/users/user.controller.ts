import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard.js';
import { UserService } from './user.service.js';
import { type UpdateUserDto } from './dto/update-user.dto.js';

@UseGuards(JwtAccessGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    return req.user;
  }

  @Patch('me/update')
  async updateMe(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.userService.updateMe(req.user.id, dto);
  }
}
