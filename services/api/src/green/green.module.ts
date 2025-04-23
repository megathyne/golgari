import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DatabaseModule } from "../common/database/database.module";

@Module({ imports: [DatabaseModule, AuthModule, DashboardModule] })
export class GreenModule {}
