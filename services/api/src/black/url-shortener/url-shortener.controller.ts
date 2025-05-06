import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, Res } from "@nestjs/common";
import { UrlShortenerService } from "./url-shortener.service";
import { Request, Response } from "express";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

@Controller("url-shortener")
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get long url" })
  @Get(":shortUrl")
  public async get(@Req() req: Request, @Param("shortUrl") shortUrl: string, @Res() res: Response) {
    const origUrl = await this.urlShortenerService.getOrigUrl(shortUrl);
    res.redirect(origUrl);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create short url" })
  @Post()
  public async post(@Req() req: any, @Body() body: { origUrl: string; customUrl?: string }) {
    return await this.urlShortenerService.createShortUrl(req.user, body.origUrl);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete short url" })
  @Delete(":id")
  public async delete(@Req() req: any, @Param() id: number) {
    return await this.urlShortenerService.deleteShortUrl(req.user, id);
  }
}
