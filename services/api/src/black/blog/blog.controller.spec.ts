import { Test, TestingModule } from "@nestjs/testing";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { AuthModule } from "../auth/auth.module";
import { WebflowApiModule } from "../../common/webflow-api/webflow-api.module";

describe("BlogController", () => {
  let controller: BlogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, WebflowApiModule],
      providers: [BlogService],
      controllers: [BlogController],
    }).compile();

    controller = module.get<BlogController>(BlogController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
