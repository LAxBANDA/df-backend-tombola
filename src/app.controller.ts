import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RewardService } from './reward/reward.service';

@Controller()
export class AppController {
  constructor(private readonly rewardService: RewardService, private readonly configService: ConfigService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  checkReward(@Request() req: any){
    console.log('checkReward')
    const canReward = this.rewardService.checkReward(req.user.last_connection)

    if(!canReward){
      console.log('!canBeReward')
      return null
    }

    console.log('rewarded')
    return 'rewarded'
  }

  canBeRewarded(lastConnection: number) : any {
    const timestampNow = Date.now();
    const pastSeconds = Math.round((timestampNow - lastConnection) / 1000);

    if(pastSeconds < this.configService.get<number>('global.timeForReward')){
      return null;
    }

    // reward
    return pastSeconds;
  }
}
