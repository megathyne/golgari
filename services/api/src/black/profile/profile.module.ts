import { Module } from "@nestjs/common";
import { UserProfileController } from "./profile.controller";
import { UserProfileService } from "./profile.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "src/common/database/entities/profile.entity";
import { User } from "src/common/database/entities/user.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Profile, User])],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
