import { Module } from "@nestjs/common";
import { UserProfileController } from "./profile.controller";
import { UserProfileService } from "./profile.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "src/common/database/entities/profile.entity";
import { Users } from "src/common/database/entities/users.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Profile, Users])],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
