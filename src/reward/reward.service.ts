import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RewardService {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {}

  /**
   * Función para cargar los creditos a un usuario
   * @param user usuario de la base de datos
   * @returns {number} nuevos creditos actualizados del usuario
   */
  async checkReward(user: User): Promise<number> {
    const canReward = this.canBeRewarded(user.last_connection)

    if(!canReward){
      return user.credit
    }

    const rewardAmount = Number(this.configService.get<number>('global.rewardAmount'))
    const { credit } = await this.userService.setCredits(user.email, user.credit || 0 + rewardAmount)
    
    return credit;
  }

  canBeRewarded(last_connection: number) : any {
    const timestampNow = Date.now();
    const pastSeconds = Math.round((timestampNow - last_connection) / 1000);

    if(pastSeconds < this.configService.get<number>('global.timeForReward')){
      return null;
    }

    // reward
    return pastSeconds;
  }

  playTombola(credits: number | string) : any {
    const result = Math.floor(Math.random() * 100)
    let win = ''
    if(credits == 1){
      if(result >= 80){
        win = 'ganaste pera'
      } else {
        win = 'ganaste manzana'
      }
    } else if(credits == 2) { // tombola 2 créditos
      if(result >= 40){
        win = 'ganaste piña'
      } else if(result >= 10){
        win = 'ganaste naranja'
      } else {
        win = 'ganaste sandia'
      }
    }

    return win
  }
}