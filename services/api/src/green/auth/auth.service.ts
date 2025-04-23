import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import * as jwt from "jsonwebtoken";

import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor() {}

  public async register(createUserDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    this.logger.log({ arguments: createUserDto, function: this.register.name });
    return {};
  }

  public async login(loginUserDto: LoginUserDto): Promise<CreateUserResponseDto> {
    this.logger.log({ arguments: { username: loginUserDto, password: "REDACTED" }, function: this.login.name });
    return {};
  }

  public async logout(token: string): Promise<void> {}

  public async resetPassword(email: string): Promise<string> {
    return "";
  }

  private async createToken({ uid, role }: { uid: string; role: string }): Promise<string> {
    const payload = {
      sub: uid,
      jti: randomUUID(),
      iat: Date.now(),
      role: role,
    };

    const secretKey = process.env.JWT_SECRET_KEY; // Replace with your own secret key

    const options = {
      expiresIn: process.env.JWT_EXPIRES_IN, // Token expiration time
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JTW_AUDIENCE,
    };

    return jwt.sign(payload, secretKey, options);
  }

  public async verify(authorization: string): Promise<string> {
    try {
      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return decoded.sub as string;
    } catch (err) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
  }
}
