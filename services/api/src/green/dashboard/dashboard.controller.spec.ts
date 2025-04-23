import { Test, TestingModule } from "@nestjs/testing";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { UserJourneyModule } from "../user-journey/user-journey.module";
import { UserProfileModule } from "../user/user.module";
import { WellnessLogModule } from "../wellness-log/wellness-log.module";
import { AuthModule } from "../auth/auth.module";
import { AuthService } from "../auth/auth.service";

const strapiServiceMock = {
  getBlogs: jest.fn(),
};

describe("DashboardController", () => {
  let controller: DashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DashboardService,
          useValue: strapiServiceMock,
        },
        {
          provide: AuthService,
          useValue: strapiServiceMock,
        },
      ],
      controllers: [DashboardController],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
