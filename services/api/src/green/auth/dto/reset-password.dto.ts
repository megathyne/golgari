import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({ type: "string" })
  @IsNotEmpty()
  email: string;
}
