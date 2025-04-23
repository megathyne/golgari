import { Test, TestingModule } from "@nestjs/testing";
import { DashboardService } from "./dashboard.service";
import { AuthModule } from "../auth/auth.module";
import { DataSource, Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { mock } from "node:test";

export type MockType<T> = { [P in keyof T]?: jest.Mock<{}> };

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository> = jest.fn(() => ({
  findOne: jest.fn(),
}));

const strapiServiceMock = {
  getBlogs: jest.fn(),
};

describe("DashboardService", () => {
  let service: DashboardService;
  // let clientInfoRepositoryMock: MockType<Repository<ClientInfo>>;

  // @ts-ignore
  const authServiceMock = jest.mock<AuthService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [DashboardService],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    // clientInfoRepositoryMock = module.get(getRepositoryToken(ClientInfo));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
