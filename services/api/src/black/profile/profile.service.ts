import { HttpException, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);

  constructor() {}

  public async get(): Promise<{}> {
    this.logger.log({ arguments: {}, function: this.get.name });

    try {
      return {};
    } catch (error) {
      this.logger.error(error, { message: error.message });
      throw new HttpException(error.message, error.status);
    }
  }
}
