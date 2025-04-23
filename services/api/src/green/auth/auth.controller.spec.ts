import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Auth0Service } from "../auth0/auth0.service";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

const authServiceMock = {
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  resetPassword: jest.fn(),
  verify: jest.fn(),
};

const auth0ServiceMock = {};

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Auth0Service, useValue: auth0ServiceMock },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a new user", async () => {
    // arrange
    const createUserRequestDto = {
      firstname: "string",
      lastname: "string",
      email: "string",
      fpUid: "string",
      password: "string",
    } as CreateUserRequestDto;

    const createUserResponseDto = {
      accessToken: "string",
      expiresIn: "string",
      lastLoginDate: "string",
      userId: "string",
    } as CreateUserResponseDto;

    jest.spyOn(authServiceMock, "register").mockReturnValue(createUserResponseDto);

    // act
    const result = await controller.register(createUserRequestDto);

    // assert
    expect(authServiceMock.register).toHaveBeenCalled();
    expect(authServiceMock.register).toHaveBeenCalledWith(createUserRequestDto);
    expect(result).toEqual(createUserResponseDto);
  });

  it("should login a user", async () => {
    // arrange
    const loginDto = {
      username: "string",
      password: "string",
    } as LoginUserDto;

    const createUserResponseDto = {
      accessToken: "string",
      expiresIn: "string",
      lastLoginDate: "string",
      userId: "string",
    } as CreateUserResponseDto;

    jest.spyOn(authServiceMock, "login").mockReturnValue(createUserResponseDto);

    // act
    const result = await controller.login(loginDto);

    // assert
    expect(authServiceMock.login).toHaveBeenCalled();
    expect(authServiceMock.login).toHaveBeenCalledWith(loginDto);
    expect(result).toEqual(createUserResponseDto);
  });

  it("should logout a user", async () => {
    // arrange
    const token = "Bearer wfwfwef" as string;

    // act
    const result = await controller.logout(token);

    // assert
    expect(authServiceMock.verify).toHaveBeenCalled();
    expect(authServiceMock.verify).toHaveBeenCalledWith(token);

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(authServiceMock.logout).toHaveBeenCalledWith("wfwfwef");

    expect(result).toEqual(undefined);
  });

  it("should reset a user password", async () => {
    // arrange
    const resetPasswordDto = {
      username: "foo",
    } as ResetPasswordDto;

    // act
    const result = await controller.resetPassword(resetPasswordDto);

    // assert
    expect(authServiceMock.resetPassword).toHaveBeenCalled();
    expect(authServiceMock.resetPassword).toHaveBeenCalledWith(resetPasswordDto.username);

    expect(result).toEqual(undefined);
  });
});
