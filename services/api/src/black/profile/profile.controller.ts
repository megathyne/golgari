import { Controller, Get, Headers } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserProfileService } from "./profile.service";

import { AuthService } from "../auth/auth.service";

@ApiTags("black")
@Controller("black/profile")
export class UserProfileController {
  constructor(
    private readonly authService: AuthService,
    private readonly userProfileService: UserProfileService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get profile" })
  @Get()
  public async getSettings(@Headers() headers: Headers): Promise<any> {
    const {} = await this.authService.verify(headers);
    return await this.userProfileService.get();
  }
}
