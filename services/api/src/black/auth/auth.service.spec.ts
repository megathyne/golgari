import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { OutsetaService } from "../../common/outseta/outseta.service";

const outsetaServiceMock = {
  getCurrentUser: jest.fn(),
};

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: OutsetaService, useValue: outsetaServiceMock }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should get tenant", async () => {
    // ARRANGE
    let headers: any = { "x-tenant-id": "edgedev" };

    // ACT
    const results = await service.getTenant(headers);

    // ASSERT
    expect(results).toEqual("edgedev");
  });

  it("should return undefined", async () => {
    // ARRANGE
    const headers: any = { "x-tenant-id": "foo" };

    // ACT
    const results = await service.getTenant(headers);

    // ASSERT
    expect(results).toEqual(undefined);
  });

  it("should verify headers", async () => {
    // ARRANGE
    const headers: any = { "x-tenant-id": "edgedev" };

    jest.spyOn(outsetaServiceMock, "getCurrentUser").mockReturnValueOnce({
      email: "",
      uid: "",
      user_id: "",
    });

    // ACT
    const results = await service.verify(headers);

    // ASSERT
    expect(results).toHaveProperty("email");
    expect(results).toHaveProperty("uid");
    expect(results).toHaveProperty("user_id");
    expect(results).toHaveProperty("tenantId");
  });
});
