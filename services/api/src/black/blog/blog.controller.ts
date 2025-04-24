import { Controller, Get, Headers, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { BlogService } from "./blog.service";
import { AuthService } from "../auth/auth.service";

@ApiTags("black")
@Controller("black/blog")
export class BlogController {
  constructor(
    private readonly authService: AuthService,
    private readonly blogService: BlogService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all blogs" })
  @Get()
  public async getBlogPosts(): Promise<any> {
    return await this.blogService.getBlogPosts();
  }
}
