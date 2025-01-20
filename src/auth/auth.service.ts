import {
  Inject,
  // BadRequestException,
  // Inject,
  Injectable,
  // NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '@src/cache/cache.service';
import { UserService } from 'src/user/user.service';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { Cache } from 'cache-manager';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, plainPassword: string): Promise<any> {
    if (username == 'test@mail.com' && plainPassword == 'pass') {
      return { name: 'fakeuser', email: 'test@mail.com' };
    }
    // const user =
    // await this.userService.findByEmail(username);

    // if (
    //   user &&
    //   (await this.userService.compareHashedPassword(
    //     plainPassword,
    //     user.password,
    //   )) &&
    //   user.isActive
    // ) {
    //   delete user.password;

    //   return user;
    // }

    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.email,
      name: user.name,
      tenantId: user.tenantId,
      roleId: user.roleId,
      sub: user.id,
    };

    await this.cacheService.set(
      `${this.configService.get('redis').prefix}_loginkey_${user.id}`,
      user.id,
      this.configService.get('jwt').exp,
    );

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(user: any) {
    await this.cacheService.delete(
      `${this.configService.get('redis').prefix}_loginkey_${user.userId}`,
    );
    return {
      message: 'logout successfully',
    };
  }

  // async changePassword(user, dto: ChangePasswordDto): Promise<any> {
  //   if (dto.confirmNewPassword != dto.newPassword) {
  //     throw new BadRequestException('Confirm password does not match');
  //   }

  //   const validatedUser = await this.validateUser(user.username, dto.oldPassword);

  //   if (!validatedUser) {
  //     throw new NotFoundException('User not found or wrong old password');
  //   }

  //   return this.userService.updatePassword(validatedUser, dto.newPassword);
  // }

  async verifyToken(token: string) {
    try {
      const user = await this.jwtService.verifyAsync(token);

      return user;
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  }
}
