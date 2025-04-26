import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { Users } from "../../common/database/entities/users.entity";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  public async create({ username, password }: CreateUserDto): Promise<void> {
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) throw new BadRequestException();

    const newUser = this.usersRepository.create();
    newUser.username = username;
    newUser.password = password;
    await this.usersRepository.save(newUser);
  }

  public async get(id: number): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) throw new BadRequestException();

    return user;
  }
}
