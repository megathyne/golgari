import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { Repository } from "typeorm";
import { User } from "../../common/database/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

export type MockType<T> = { [P in keyof T]?: jest.Mock<{}> };

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository> = jest.fn(() => ({
  findOne: jest.fn(),
}));

describe("UserService", () => {
  let service: UserService;
  let usersRepositoryMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    usersRepositoryMock = module.get(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
