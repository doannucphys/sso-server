import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, plainPassword: string): Promise<any> {
    // get mock user
    const user = await this.userService.findByEmail(username);

    // mock check password
    if (username == user.username && plainPassword == 'pass') {
      return { name: user.name, username: user.username, id: user.id };
    }

    return null;
  }

  async generateToken(user: any) {
    const payload = {
      username: user.username,
      name: user.name,
      id: user.id,
    };

    let oldAccessToken = await this.cacheService.get(
      `${this.configService.get('redis').prefix}_loginkey_${user.id}`,
    );

    if (!oldAccessToken) {
      const accessToken = this.jwtService.sign(payload);
      await this.cacheService.set(
        `${this.configService.get('redis').prefix}_loginkey_${user.id}`,
        // user.id,
        accessToken,
        this.configService.get('jwt').exp,
      );

      oldAccessToken = accessToken;
    }

    return {
      access_token: oldAccessToken,
    };
  }

  async logout(user: any) {
    await this.cacheService.del(
      `${this.configService.get('redis').prefix}_loginkey_${user.id}`,
    );
    return {
      message: 'logout successfully',
    };
  }
}
