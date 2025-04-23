import { Body, Controller, Headers, HttpCode, Post } from "@nestjs/common";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";

@ApiTags("green")
@Controller("green/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: CreateUserRequestDto, required: true })
  @Post("register")
  public async register(@Body() createUserDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return await this.authService.register(createUserDto);
  }

  @ApiBody({ type: LoginUserDto, required: true })
  @Post("login")
  @HttpCode(200)
  public async login(@Body() loginUserDto: LoginUserDto): Promise<CreateUserResponseDto> {
    return await this.authService.login(loginUserDto);
  }

  @ApiBearerAuth()
  @Post("logout")
  public async logout(@Headers("authorization") authorization): Promise<void> {
    const uid = await this.authService.verify(authorization);
    return await this.authService.logout(authorization.split(" ")[1]);
  }

  @ApiBody({ type: ResetPasswordDto, required: true })
  @Post("reset-password")
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<string> {
    return await this.authService.resetPassword(resetPasswordDto.email);
  }
}
