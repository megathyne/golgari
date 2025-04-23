import { Test, TestingModule } from '@nestjs/testing';
import { AwsSecretsManagerService } from './aws-secrets-manager.service';

describe('AwsSecretsManagerService', () => {
  let service: AwsSecretsManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsSecretsManagerService],
    }).compile();

    service = module.get<AwsSecretsManagerService>(AwsSecretsManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
