import { Controller, Get, Headers, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { BlogService } from "./blog.service";
import { AuthService } from "../auth/auth.service";

@ApiTags("black")
@Controller("black/blog")
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all blogs" })
  @Get()
  public async getBlogPosts(): Promise<any> {
    return await this.blogService.getBlogPosts();
  }
}
