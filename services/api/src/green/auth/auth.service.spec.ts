import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { ClientInfo } from "../../common/database/entities/client-info.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UidMaster } from "../../common/database/entities/uid-master.entitiy";
import { UidMapping } from "../../common/database/entities/uid-mapping.entity";
import { TokenBlacklist } from "../../common/database/entities/token-blacklist.entity";
import { Auth0Service } from "../auth0/auth0.service";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { Repository } from "typeorm";
import { Role } from "../constants";

export type MockType<T> = { [P in keyof T]?: jest.Mock<{}> };

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository> = jest.fn(() => ({
  findOne: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
}));

const auth0ServiceMock = {
  createUser: jest.fn(),
  auth0login: jest.fn(),
  getLastLoginDate: jest.fn(),
  resetPassword: jest.fn(),
};

describe("AuthService", () => {
  let service: AuthService;
  let uidMasterRepositoryMock: MockType<Repository<UidMaster>>;
  let tokenBlacklistRepositoryMock: MockType<Repository<TokenBlacklist>>;
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: Auth0Service, useValue: auth0ServiceMock },
        { provide: getRepositoryToken(UidMaster), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(UidMapping), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(ClientInfo), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(TokenBlacklist), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    uidMasterRepositoryMock = module.get(getRepositoryToken(UidMaster));
    tokenBlacklistRepositoryMock = module.get(getRepositoryToken(TokenBlacklist));
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a user", async () => {
    // arrange
    const createUserRequestDto = {
      firstname: "string",
      lastname: "string",
      email: "string",
      fpUid: "string",
      password: "string",
    } as CreateUserRequestDto;

    jest
      .spyOn(uidMasterRepositoryMock, "findOneBy")
      .mockReturnValueOnce({
        clientMappings: [],
      })
      .mockReturnValueOnce({
        clientMappings: [],
      })
      .mockReturnValueOnce({
        auth0Id: "ee",
      });

    jest.spyOn(auth0ServiceMock, "auth0login").mockReturnValue({});

    process.env.JWT_SECRET_KEY = "dadddedde";
    process.env.JWT_EXPIRES_IN = "60";
    process.env.JWT_ISSUER = "dadddedde";
    process.env.JTW_AUDIENCE = "dadddedde";

    // act
    const result = (await service.register(createUserRequestDto)) as CreateUserResponseDto;

    // assert
    expect(uidMasterRepositoryMock.findOneBy).toHaveBeenCalled();
    expect(uidMasterRepositoryMock.findOneBy).toHaveBeenCalledWith({ role: Role.FP, uid: createUserRequestDto.fpUid });
    expect(result).toHaveProperty("accessToken");
    expect(result).toHaveProperty("expiresIn");
    expect(result).toHaveProperty("lastLoginDate");
    expect(result).toHaveProperty("userId");
  });

  it("should log a user in", async () => {
    // Arrange
    const loginUserDto = { username: "foo", password: "bar" };

    process.env.JWT_SECRET_KEY = "dadddedde";
    process.env.JWT_EXPIRES_IN = "60";
    process.env.JWT_ISSUER = "dadddedde";
    process.env.JTW_AUDIENCE = "dadddedde";

    jest.spyOn(uidMasterRepositoryMock, "findOneBy").mockReturnValueOnce({
      auth0Id: "foo",
    });

    // Act
    const result = await service.login(loginUserDto);

    // Assert
    expect(uidMasterRepositoryMock.findOneBy).toHaveBeenCalled();
    expect(result).toHaveProperty("accessToken");
    expect(result).toHaveProperty("expiresIn");
    expect(result).toHaveProperty("lastLoginDate");
    expect(result).toHaveProperty("userId");
  });

  it("should logout a user", async () => {
    // Arrage
    const token = "abcd1234";

    // Act
    const result = await service.logout(token);

    // Assert
    expect(tokenBlacklistRepositoryMock.findOne).toHaveBeenCalled();
  });

  it("should reset a user password", async () => {
    // Arrage
    const username = "abcd1234";

    // Act
    const result = await service.resetPassword(username);

    // Assert
    expect(auth0ServiceMock.resetPassword).toHaveBeenCalled();
  });

  it("should verify a token", async () => {
    // Arrange
    const loginUserDto = { username: "foo", password: "bar" };
    process.env.JWT_SECRET_KEY = "dadddedde";
    process.env.JWT_EXPIRES_IN = "60";
    process.env.JWT_ISSUER = "dadddedde";
    process.env.JTW_AUDIENCE = "dadddedde";

    jest.spyOn(uidMasterRepositoryMock, "findOneBy").mockReturnValueOnce({ auth0Id: "foo" });
    const loginResponse = await service.login(loginUserDto);

    const authorization = `Bearer ${loginResponse.accessToken}`;

    // Act
    const result = await service.verify(authorization);

    // Assert
    expect(tokenBlacklistRepositoryMock.findOne).toHaveBeenCalled();
  });
});
