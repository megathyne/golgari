import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { UserModule } from "../user/user.module";
import { ChatService } from "./chat.service";
import { Chat } from "src/common/database/entities/chat.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Chat])],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
