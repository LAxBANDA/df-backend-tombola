import { Body, Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { User } from "./user.schema";

import { UserService } from "./user.service";

@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Request() req): Promise<any> {
    return this.userService.findUserByEmail(req.user.username);
  }

  @Get("register")
  async register(@Body('user') user: User): Promise<any> {
    return this.userService.register(user);
  }
}