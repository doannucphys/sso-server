import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '@src/cache/cache.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
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
      `${this.configService.get('redis').prefix}_loginkey_${user.id}`,
    );
    return {
      message: 'logout successfully',
    };
  }
}
