import { Module } from "@nestjs/common";
import { AwsSecretsManagerService } from "./aws-secrets-manager.service";

@Module({
  providers: [AwsSecretsManagerService],
  exports: [AwsSecretsManagerService],
})
export class AwsSecretsManagerModule {}
