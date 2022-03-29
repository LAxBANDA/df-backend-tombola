import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'teumPGxp1hYQBjHudSz6iS3CWPgcJ9PwbzcDXmcKdEhIFJ89Ewvbc3c1mT/FiRK/sRDXdcRrqZl9++pWlT0tBCFfvwd9+CLHb1DlUxIIaBWBUGcvYGTMDP92QXAshXv2ciojn8G0dJzV+rJudGL9qHx+9Aa0O5uxIPxZM7p7E5jX84OR0221QNLK1sI9fzHRP8Tv6UHPxouHTBozzOBY5reUNbSwk0RqEY8juN7awFWerZA/4PVi08QSxvGqNtnJOlnpjXmK30Xosdj2b5h606KvzxhOZ2+Y3u6C+jENktr6+//WnCLtTTKUb3HsyumrazJZPDCb/WxE1M+JDedkyg==',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], 
})
export class AuthModule {}