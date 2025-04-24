import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DatabaseModule } from "../common/database/database.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "src/black/auth/auth.guard";

@Module({
  imports: [DatabaseModule, AuthModule, DashboardModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class GreenModule {}
