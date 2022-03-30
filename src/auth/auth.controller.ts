import { Controller, Get, Post, UseGuards, Res, Req } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request, Response } from 'express';

@Controller("api/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: Request, @Res() response: Response) {
    const JWT_TOKEN_EXPIRES = 1; // 1 dia

    const token = await this.authService.login(request.user);

    return response.cookie('access_token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * JWT_TOKEN_EXPIRES),
    })
    .send(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const token = await this.authService.login(request.user);
    
    return response.cookie('access_token', token, {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .send(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validate(@Req() req: Request) {
    return req.user;
  }
}