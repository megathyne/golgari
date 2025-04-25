import { HttpException, Injectable, Logger } from "@nestjs/common";
import { AwsS3Service } from "../../common/aws-s3/aws-s3.service";
import { AwsSecretsManagerService } from "../../common/aws-secrets-manager/aws-secrets-manager.service";

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly awsSecretsManagerService: AwsSecretsManagerService,
  ) {}

  public async update({ executionId }): Promise<void> {}
}
