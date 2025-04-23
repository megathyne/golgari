import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { BlogModule } from "./blog/blog.module";
import { DatabaseModule } from "../common/database/database.module";
import { UserProfileModule } from "./profile/profile.module";

@Module({
  imports: [DatabaseModule, UserProfileModule, BlogModule, AuthModule],
})
export class BlackModule {}
