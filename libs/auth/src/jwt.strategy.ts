import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authCfg: ConfigType<typeof authConfig>
  ) {
    const jwtSecret = authCfg.jwt_secret;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('JWT payload is missing');
    }
    if (!payload.sub) {
      throw new UnauthorizedException('JWT payload is missing the "sub" field');
    }
    if (!payload.email) {
      throw new UnauthorizedException(
        'JWT payload is missing the "email" field'
      );
    }
    return { userId: payload.sub, email: payload.email };
  }
}
