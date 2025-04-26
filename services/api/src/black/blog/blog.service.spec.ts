import { Test, TestingModule } from "@nestjs/testing";
import { BlogService } from "./blog.service";
import { AuthModule } from "../auth/auth.module";

describe("BlogService", () => {
  let service: BlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [BlogService],
    }).compile();

    service = module.get<BlogService>(BlogService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
