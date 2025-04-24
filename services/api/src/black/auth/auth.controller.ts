import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Public } from "./constants";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags("black")
@Controller("black/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login user" })
  @Post("login")
  public async login(@Body() body: LoginUserDto) {
    return await this.authService.login(body);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create user" })
  @Post("create")
  public async create(@Body() body: CreateUserDto) {
    return await this.authService.create(body);
  }
}
