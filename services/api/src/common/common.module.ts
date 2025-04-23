import { Module } from "@nestjs/common";
import { AwsSecretsManagerModule } from "./aws-secrets-manager/aws-secrets-manager.module";
import { AwsS3Module } from "./aws-s3/aws-s3.module";
import { DatabaseModule } from "./database/database.module";

@Module({ imports: [AwsSecretsManagerModule, AwsS3Module, DatabaseModule] })
export class CommonModule {}
