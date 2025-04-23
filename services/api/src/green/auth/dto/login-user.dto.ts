import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @ApiProperty({ type: "string" })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: "string" })
  @IsNotEmpty()
  password: string;
}
