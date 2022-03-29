import { registerAs } from "@nestjs/config";

export default registerAs('global', () => ({
  timeForReward: process.env.TIME_FOR_REWARD,
  rewardAmount: process.env.REWARD_AMOUNT
}));