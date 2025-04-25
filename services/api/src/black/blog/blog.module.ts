import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { AuthModule } from '../auth/auth.module';
import { BlogService } from './blog.service';

@Module({
  imports: [AuthModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
