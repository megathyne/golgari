import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FriendService } from "./friend.service";
import { CreateFriendDto } from "./dto/create-friend.dto";

@ApiTags("black")
@Controller("black/friend")
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Send a friend request" })
  @Post("request")
  public async postRequest(@Request() req: any, @Body() body: CreateFriendDto) {
    return await this.friendService.request();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Accept or decline a request" })
  @Post("respond")
  public async postRespond(@Request() req: any, @Body() body: any) {
    return await this.friendService.respond();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "List friend requests for the current user" })
  @Get("requests")
  public async getRequests(@Request() req: any) {
    return await this.friendService.requests();
  }

  @HttpCode(HttpStatus.OK)
  @Get("status")
  @ApiOperation({ summary: "Check friendship status" })
  public async getStatus(@Request() req: any) {
    return await this.friendService.status();
  }
}
