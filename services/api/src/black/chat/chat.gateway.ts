import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { Server, Socket } from "socket.io";
import { AuthWsMiddleware } from "./AuthWsMiddleware";
import { UserService } from "../user/user.service";
import { ChatService } from "./chat.service";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer() server: Server;

  async afterInit(@ConnectedSocket() socket: Socket) {
    socket.use(AuthWsMiddleware(this.jwtService, this.userService));
  }

  handleConnection(data: any) {
    console.log(data.user);
    this.logger.log(`Client connected ${data.user.id}`);
    data.broadcast.emit("user-joined", {
      message: `User joined the chat: ${data.user.id}`,
      clientId: data.user.id,
    });
  }

  handleDisconnect(@ConnectedSocket() client: any) {
    this.logger.log(`Client disconnected ${client.user.id}`);
    this.server.emit("user-left", {
      message: `User left the chat: ${client.user.id}`,
      clientId: client.user.id,
    });
  }

  @SubscribeMessage("message")
  async handleNewMessage(@ConnectedSocket() client: any, @MessageBody() message: any): Promise<void> {
    this.logger.log(`New message: ${message}`);
    await this.chatService.createChat(client.user, message);
    this.server.emit("message", message);
  }
}
