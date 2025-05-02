import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "src/common/database/entities/chat.entity";
import { Users } from "src/common/database/entities/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  constructor(@InjectRepository(Chat) private chatRepository: Repository<Chat>) {}

  public async createChat(user: Users, message: string) {
    const chat = this.chatRepository.create();
    chat.user = user;
    chat.message = message;
    await this.chatRepository.save(chat);
  }
}
