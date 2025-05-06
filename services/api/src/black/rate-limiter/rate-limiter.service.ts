import { Injectable, NestMiddleware, HttpException, HttpStatus } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { TokenBucket } from "./implementations/token-bucket";

@Injectable()
export class RateLimiterService implements NestMiddleware {
  bucket = new TokenBucket(10, 5);

  use(req: Request, res: Response, next: NextFunction) {
    if (this.bucket.tryRemoveToken()) {
      next();
    } else {
      throw new HttpException("Too Many Requests", HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}
