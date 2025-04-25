import { IsNotEmpty, IsString } from "class-validator";

export class QualtricsWebhookDto {
  @IsString()
  @IsNotEmpty()
  surveyId: string;

  @IsString()
  @IsNotEmpty()
  responseId: string;
}
