import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User as Collection, UserSchema as Schema } from "./user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Collection.name, schema: Schema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}