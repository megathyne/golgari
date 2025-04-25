import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from './blog.service';
import { WebflowApiModule } from '../../common/webflow-api/webflow-api.module';
import { AuthModule } from '../auth/auth.module';


describe('BlogService', () => {
  let service: BlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, WebflowApiModule],
      providers: [BlogService],
    }).compile();

    service = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
