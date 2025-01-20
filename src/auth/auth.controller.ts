import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDTO })
  async login(@Request() req: LoginDTO): Promise<any> {
    return this.authService.login((req as any).user);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(@Request() req): Promise<any> {
    return this.authService.logout((req as any).user);
  }
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @Post('change_password')
  // @ApiResponse({ status: 201, description: 'Password has successfully changed' })
  // @ApiResponse({ status: 400, description: 'Confirm password does not match' })
  // @ApiResponse({ status: 404, description: 'User not found or wrong old password' })
  // async changePassword(@Request() req, @Body() dto: ChangePasswordDto): Promise<any> {
  //   return this.authService.changePassword(req.user, dto);
  // }
}
