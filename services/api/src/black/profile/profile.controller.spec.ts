import { Test, TestingModule } from "@nestjs/testing";
import { UserProfileController } from "./profile.controller";
import { UserProfileService } from "./profile.service";
import { AuthModule } from "../auth/auth.module";

describe("UserProfileController", () => {
  let controller: UserProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [UserProfileService],
      controllers: [UserProfileController],
    }).compile();

    controller = module.get<UserProfileController>(UserProfileController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
