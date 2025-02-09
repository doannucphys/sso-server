import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
     @Inject(CACHE_MANAGER) private cacheService: Cache,
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
