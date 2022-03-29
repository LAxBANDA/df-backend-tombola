import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log('validateUser', username, password)
    const user = await this.usersService.findUserByEmail(username);
    
    if(!user) {
        return null;
    } 

    const valid = await bcrypt.compare(password, user.password);

    if(!valid){ 
        return null;
    }

    return user; 
  }

  async login(user: any) {
    console.log('login auth service', user)
    const payload = { username: user.email, sub: user.id };
    
    return this.jwtService.sign(payload);
  }

  async verify(accessToken: string) {
    return this.jwtService.verify(accessToken, { secret: this.configService.get<string>('jwt.secret') });
  }
}