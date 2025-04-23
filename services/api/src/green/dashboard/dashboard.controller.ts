import { Controller, Get, Headers } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { AuthService } from "../auth/auth.service";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetDashboardResponseDto } from "./dto/get-dashboard-response.dto";

@ApiTags("green")
@Controller("green/dashboard")
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthService,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({ type: GetDashboardResponseDto })
  @Get()
  public async getDashboard(@Headers("authorization") authorization): Promise<GetDashboardResponseDto> {
    const uid = await this.authService.verify(authorization);
    return await this.dashboardService.getDashboard(uid);
  }
}
