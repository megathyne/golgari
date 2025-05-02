import { Module } from "@nestjs/common";
import { UrlShortenerService } from "./url-shortener.service";
import { UrlShortenerController } from "./url-shortener.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Url } from "src/common/database/entities/url.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  providers: [UrlShortenerService],
  controllers: [UrlShortenerController],
})
export class UrlShortenerModule {}
