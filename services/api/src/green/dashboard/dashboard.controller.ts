import { Controller, Get, Headers } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetDashboardResponseDto } from "./dto/get-dashboard-response.dto";

@ApiTags("green")
@Controller("green/dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiBearerAuth()
  @ApiResponse({ type: GetDashboardResponseDto })
  @Get()
  public async getDashboard(): Promise<GetDashboardResponseDto> {
    return await this.dashboardService.getDashboard();
  }
}
