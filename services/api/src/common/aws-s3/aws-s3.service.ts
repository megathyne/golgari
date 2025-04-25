import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { UploadGrowthMetricsFileDto } from "./dto/upload-growth-metrics-file.dto";

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  private async uploadFile(command: PutObjectCommand): Promise<string> {
    try {
      await this.s3Client.send(command);
      return `https://${command.input.Bucket}.s3.amazonaws.com/${command.input.Key}`;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw error;
    }
  }

  async uploadGrowthMetricsFile({ Bucket, Key, Body, ContentType }: UploadGrowthMetricsFileDto): Promise<string> {
    const command = new PutObjectCommand({ Bucket, Key, Body, ContentType });
    return await this.uploadFile(command);
  }
}
