import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import config from 'src/config';
import { ConfigType } from '@nestjs/config';
import { PayloadToken, JwtPayloadWithRt } from '../models/tokens.model';
import { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.tokens_secret.refresh,
      passReqToCallback: true,
      algorithms: ['HS256'],
    });
  }

  validate(req: Request, payload: PayloadToken): JwtPayloadWithRt {
    const refreshToken = req
      ?.get('Authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return {
      ...payload,
      refreshToken,
    };
  }
}
