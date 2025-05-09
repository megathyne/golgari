import { Injectable, NestMiddleware, HttpException, HttpStatus } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { TokenBucket } from "./implementations/token-bucket";
import { LeakyBucket } from "./implementations/leaky-bucket";

@Injectable()
export class RateLimiterService implements NestMiddleware {
  // bucket = new TokenBucket(10, 5);
  bucket = new LeakyBucket(10, 100);

  // token bucket middleware
  // use(req: Request, res: Response, next: NextFunction) {
  //   if (this.bucket.take()) {
  //     next();
  //   } else {
  //     throw new HttpException("Too Many Requests", HttpStatus.TOO_MANY_REQUESTS);
  //   }
  // }

  use(req: Request, res: Response, next: NextFunction) {
    if (!this.bucket.add(next)) {
      // task added
    } else {
      throw new HttpException("Too Many Requests", HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}
