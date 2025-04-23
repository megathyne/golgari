import { Injectable } from "@nestjs/common";
import { GetDashboardResponseDto } from "./dto/get-dashboard-response.dto";

@Injectable()
export class DashboardService {
  constructor() {}

  public async getDashboard(uid: string): Promise<GetDashboardResponseDto> {
    return {};
  }
}
