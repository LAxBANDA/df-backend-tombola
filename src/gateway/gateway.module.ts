import { Module } from "@nestjs/common";
import { EventsGateway } from "./app.gateway";
import { AuthModule } from "src/auth/auth.module";
import { RewardModule } from "src/reward/reward.module";
import { UserModule } from "src/user/user.module";

@Module({
    providers: [EventsGateway],
    imports: [AuthModule, RewardModule, UserModule]
})
export class GatewayModule {}