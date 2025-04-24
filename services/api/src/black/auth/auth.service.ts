import { HttpException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { VerifyResponseDto } from "./dto/verify-response.dto";
import { Users } from "src/common/database/entities/users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  public async login({ username, password }: LoginUserDto): Promise<{ accessToken: string }> {
    this.logger.log({ arguments: { username, password: "REDACTED" }, function: this.login.name });

    const user = await this.usersRepository.findOne({
      where: { username, password },
    });

    if (!user) throw new UnauthorizedException();

    const payload = { sub: user.id, username: user.username };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  public async create({ username, password }: CreateUserDto): Promise<{ accessToken: string }> {
    this.logger.log({ arguments: { username, password: "REDACTED" }, function: this.create.name });

    await this.userService.create({ username, password });
    return await this.login({ username, password });
  }

  public async verify(token: string): Promise<any> {
    this.logger.log({ arguments: { token: "REDACTED" }, function: this.verify.name });
    this.jwtService.verify(token);
  }
}
