import { Module } from "@nestjs/common";
import { WebhooksService } from "./webhooks.service";
import { WebhooksController } from "./webhooks.controller";
import { AwsS3Module } from "src/common/aws-s3/aws-s3.module";
import { AwsSecretsManagerModule } from "src/common/aws-secrets-manager/aws-secrets-manager.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [AwsS3Module, AwsSecretsManagerModule, TypeOrmModule.forFeature([])],
  providers: [WebhooksService],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
