import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Patch, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@ApiTags("black")
@Controller("black/profile")
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Patch profile" })
  @Patch()
  public async update(@Request() req: any, @Body() body: UpdateProfileDto): Promise<any> {
    return await this.userProfileService.update(req.user.sub, body);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Patch profile" })
  @Get()
  public async get(@Request() req: any): Promise<any> {
    return await this.userProfileService.get(req.user.sub);
  }
}
