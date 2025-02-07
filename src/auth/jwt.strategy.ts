import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt').publicKey,
    });
  }

  async validate(payload: any) {
    const logindata = await this.cacheService.get(
      `${this.configService.get('redis').prefix}_loginkey_${payload.id}`,
    );

    if (!logindata) {
      throw new UnauthorizedException();
    }

    return {
      id: payload.id,
      username: payload.username,
      name: payload.name,
    };
  }
}
