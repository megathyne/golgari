import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { Server, Socket } from "socket.io";
import { jwtConstants } from "../auth/constants";

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const AuthWsMiddleware = (jwtService: JwtService, userService: UserService): any => {
  return async (socket: Socket, next) => {
    try {
      // const token = socket.handshake?.auth?.token;
      // below is the override for postman
      const token = socket.handshake?.headers?.auth as string;

      if (!token) {
        throw new Error("Authorization token is missing");
      }

      let payload: any | null = null;

      try {
        payload = await jwtService.verifyAsync<{ sub: number; username: string; iat: number; exp: number }>(token, {
          secret: jwtConstants.secret,
        });
      } catch (error) {
        throw new Error("Authorization token is invalid");
      }

      const user = await userService.getById(payload.sub);
      if (!user) {
        throw new Error("User does not exist");
      }

      socket = Object.assign(socket, { user });
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  };
};
