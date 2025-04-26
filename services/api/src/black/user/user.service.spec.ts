import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { Repository } from "typeorm";
import { Users } from "../../common/database/entities/users.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

export type MockType<T> = { [P in keyof T]?: jest.Mock<{}> };

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository> = jest.fn(() => ({
  findOne: jest.fn(),
}));

describe("UserService", () => {
  let service: UserService;
  let usersRepositoryMock: MockType<Repository<Users>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    usersRepositoryMock = module.get(getRepositoryToken(Users));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
