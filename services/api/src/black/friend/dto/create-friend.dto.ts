import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateFriendDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}
