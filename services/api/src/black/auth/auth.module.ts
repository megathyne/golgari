import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/common/database/entities/users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
