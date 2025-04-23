import { Module } from "@nestjs/common";
import { UserProfileController } from "./profile.controller";
import { AuthModule } from "../auth/auth.module";
import { UserProfileService } from "./profile.service";

@Module({
  imports: [AuthModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
