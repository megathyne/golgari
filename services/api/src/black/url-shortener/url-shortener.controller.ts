import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { UrlShortenerService } from "./url-shortener.service";
import { Response } from "express";

@Controller("url-shortener")
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Get(":shortUrl")
  public async get(@Param("shortUrl") shortUrl: string, @Res() res: Response) {
    const origUrl = await this.urlShortenerService.getOrigUrl(shortUrl);
    res.redirect(origUrl);
  }

  @Post()
  public async post(@Body() body: { origUrl: string }) {
    return await this.urlShortenerService.createShortUrl(body.origUrl);
  }
}
