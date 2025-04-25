import { Test, TestingModule } from "@nestjs/testing";
import { UserProfileService } from "./profile.service";
import { AuthService } from "../auth/auth.service";

const authServiceMock = {
  verify: jest.fn(),
};

const dataLakeServiceMock = {
  getCrmStatus: jest.fn(),
  updateRedtailSettings: jest.fn(),
  syncRedtail: jest.fn(),
};

const outsetaServiceMock = {};

describe("UserProfileService", () => {
  let service: UserProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [AuthModule, DatalakeModule, OutsetaModule],
      providers: [UserProfileService, { provide: DatalakeService, useValue: dataLakeServiceMock }],
    }).compile();

    service = module.get<UserProfileService>(UserProfileService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a redtail sync", async () => {
    // ARRANGE
    const params = {
      uid: "123",
      tenantId: "45",
      username: "21",
      password: "12",
    };
    // ACT
    const results = await service.setRedtailCredentails(params);

    // ASSERT
    expect(results).toHaveProperty("success");
    expect(results).toHaveProperty("message");
  });

  it("should sync redtail", async () => {
    // ARRANGE
    const params = {
      uid: "123",
      tenantId: "45",
    };

    jest.spyOn(dataLakeServiceMock, "syncRedtail").mockReturnValueOnce({
      count: 5,
      success: true,
    });
    
    // ACT
    const results = await service.postRedtailSync(params);

    // ASSERT
    expect(results).toHaveProperty("count");
    expect(results).toHaveProperty("success");
  });

  it("should get integration status", async () => {
    // ARRANGE
    const param = { uid: "123", tenantId: "45" };

    jest.spyOn(authServiceMock, "verify").mockReturnValueOnce({});

    jest.spyOn(dataLakeServiceMock, "getCrmStatus").mockReturnValueOnce({
      black_diamond: "",
      redtail: "",
      wealthbox: "",
    });

    // ACT
    const results = await service.getIntegrationsStatus(param);

    // ASSERT
    expect(results).toHaveProperty("black_diamond");
    expect(results).toHaveProperty("redtail");
    expect(results).toHaveProperty("wealthbox");
  });
});
