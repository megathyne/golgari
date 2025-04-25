import { Injectable } from "@nestjs/common";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

@Injectable()
export class AwsSecretsManagerService {
  private readonly client: SecretsManagerClient;

  constructor() {
    this.client = new SecretsManagerClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async getSecret<T>(secretId: string): Promise<T> {
    const command = new GetSecretValueCommand({ SecretId: `golgari/${secretId}` });

    const response = await this.client.send(command);

    if (!response.SecretString) throw new Error("SecretString is not defined");

    return JSON.parse(response.SecretString) as T;
  }
}
