import { Controller, Get, Query, Req, Res } from "@nestjs/common";
import { WebhooksService } from "./webhooks.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("external")
@Controller("external/webhooks")
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get("update")
  async update(@Req() req: Request): Promise<void> {
    const executionId = req.headers["x-correlation-id"];
    await this.webhooksService.update({ executionId });
  }
}
