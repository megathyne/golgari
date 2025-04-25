import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);
  constructor() {}

  public async getBlogPosts() {
    this.logger.log({ arguments: {}, function: this.getBlogPosts.name });

    return ["blog", "blog", "blog"];
  }
}
