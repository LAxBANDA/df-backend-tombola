import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        let data = req?.cookies?.access_token;
        console.log('jwt token', data)
        if(!data){
            return null;
        }
        return data;
      },
      ignoreExpiration: false,
      // secretOrKey: configService.get<string>('jwt.secret'),
      secretOrKey: 'teumPGxp1hYQBjHudSz6iS3CWPgcJ9PwbzcDXmcKdEhIFJ89Ewvbc3c1mT/FiRK/sRDXdcRrqZl9++pWlT0tBCFfvwd9+CLHb1DlUxIIaBWBUGcvYGTMDP92QXAshXv2ciojn8G0dJzV+rJudGL9qHx+9Aa0O5uxIPxZM7p7E5jX84OR0221QNLK1sI9fzHRP8Tv6UHPxouHTBozzOBY5reUNbSwk0RqEY8juN7awFWerZA/4PVi08QSxvGqNtnJOlnpjXmK30Xosdj2b5h606KvzxhOZ2+Y3u6C+jENktr6+//WnCLtTTKUb3HsyumrazJZPDCb/WxE1M+JDedkyg=='
    });
  }

  async validate(payload: any) {
    console.log('validate jwt.strategy', payload)
    return { username: payload.username };
  }
}