import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DatabaseModule } from "../common/database/database.module";
import { AuthModule } from "src/black/auth/auth.module";
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
