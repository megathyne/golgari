import { HttpException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "src/common/database/entities/profile.entity";
import { User } from "src/common/database/entities/user.entity";
import { Repository } from "typeorm";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);

  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  public async update(id: number, updateProfileDto: UpdateProfileDto): Promise<void> {
    this.logger.log({ arguments: { id }, function: this.update.name });

    const user = await this.usersRepository.findOne({ where: { id }, relations: { profile: true } });
    const profile = this.profileRepository.create(updateProfileDto);
    user.profile = await this.profileRepository.save(profile);
    await this.usersRepository.save(user);
  }

  public async get(id: number): Promise<Profile> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: { profile: true } });
    return user.profile;
  }
}
