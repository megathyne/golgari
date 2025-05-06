import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { BlogModule } from "./blog/blog.module";
import { DatabaseModule } from "../common/database/database.module";
import { UserProfileModule } from "./profile/profile.module";
import { UserModule } from "./user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth/auth.guard";
import { UrlShortenerModule } from "./url-shortener/url-shortener.module";
import { ChatModule } from "./chat/chat.module";
import { FriendModule } from './friend/friend.module';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';

@Module({
  imports: [AuthModule, BlogModule, DatabaseModule, UserModule, UserProfileModule, UrlShortenerModule, ChatModule, FriendModule, RateLimiterModule],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class BlackModule {}
