import { Body, Controller, Get, HttpException, HttpStatus, Query, Request, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserService } from "src/user/user.service";

import { RewardService } from "./reward.service";

@Controller("api/reward")
export class RewardController {
  constructor(private readonly rewardService: RewardService, private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get("playtombola")
  async playTombola(@Request() req, @Query('credits') credits: number): Promise<any> {
    const win = await this.rewardService.playTombola(credits);

    const { credit } = await this.userService.findUserByEmail(req.user.username);

    credits = typeof credits === 'string' ? Number(credits) : credits

    const newCredits = credit - credits
    if(newCredits < 0){
      throw new HttpException({ status: HttpStatus.FORBIDDEN, error: 'No tienes creditos suficientes para girar esta tombola'}, HttpStatus.FORBIDDEN) 
    }

    await this.userService.setCredits(req.user.username, newCredits)
    return { win: win, credits: newCredits}
  }
}