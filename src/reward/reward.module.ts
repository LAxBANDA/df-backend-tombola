import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';

@Module({
    exports: [
        RewardService,
    ],
    imports: [UserModule],
    controllers: [RewardController],
    providers: [RewardService, ConfigService],
})
export class RewardModule {}
