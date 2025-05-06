import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "../../common/database/entities/user.entity";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  public async create({ username, password }: CreateUserDto): Promise<void> {
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) throw new BadRequestException();

    const newUser = this.usersRepository.create();
    newUser.username = username;
    newUser.password = password;
    await this.usersRepository.save(newUser);
  }

  public async getById(id: number): Promise<User> {
    return await this.usersRepository.findOne({ where: { id } });
  }
}
