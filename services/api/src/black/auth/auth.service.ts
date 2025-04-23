import { BadRequestException, HttpException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { VerifyResponseDto } from "./dto/verify-response.dto";
import { Users } from "src/common/database/entities/users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  public async login({ username, password }: { username: string; password: string }): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    // TODO: Generate a JWT and return it here
    // instead of the user object
    return "123456";
  }

  public async verify(headers: Headers): Promise<VerifyResponseDto> {
    this.logger.log({ arguments: { headers: "REDACTED" }, function: this.verify.name });

    return {};
  }
}
