import { Controller, Get, UseGuards, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HttpExceptionFilter } from '@src/shared/filter/http-exception.filter';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @UseFilters(new HttpExceptionFilter())
  @ApiBearerAuth()
  findOne() {
    return this.userService.getProfile();
  }
}
