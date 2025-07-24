import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Query,
  DefaultValuePipe,
  Body,
} from '@nestjs/common';
import { FollowerService } from './follower.service';
import { ValidateMongooseObjectIdPipe } from 'src/common/pipes/validate.mongoose.object-id/validate.mongoose.object-id.pipe';
import { User } from 'src/common/decorators/user/user.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { createApiResponse } from 'src/common/utils/response';
import { AcceptFollowRequestDto } from './dto/accept.follow.request.dto';
import { RejectFollowRequestDto } from './dto/reject.follower.request.dto';

@Controller('follower')
@UseGuards(AuthGuard)
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Get('requests/me')
  async getFollowRequests(
    @User('id') userId: string,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    const followRequests =
      await this.followerService.getAllFollowRequestService(
        userId,
        page,
        limit,
      );
    return createApiResponse('Your pending follow requests', followRequests);
  }

  @Get('followers/me')
  async getMyFollowers(
    @User('id') userId: string,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    const followers = await this.followerService.findAllFollowersService(
      userId,
      page,
      limit,
    );
    return createApiResponse('Your followers have been fetched', followers);
  }

  @Get('following/me')
  async getMyFollowings(
    @User('id') userId: string,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    const following = await this.followerService.findAllFollowingService(
      userId,
      page,
      limit,
    );
    return createApiResponse('Your followings have been fetched', following);
  }

  @Get('followers/:id')
  async findAllFollowersController(
    @Param('id', ValidateMongooseObjectIdPipe) userId: string,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    const followers = await this.followerService.findAllFollowersService(
      userId,
      page,
      limit,
    );
    return createApiResponse(
      'All of you followers have been fetched successfully',
      followers,
    );
  }

  @Get('following/:id')
  async findAllFollowingsController(
    @Param('id', ValidateMongooseObjectIdPipe) userId: string,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    const followings = await this.followerService.findAllFollowingService(
      userId,
      page,
      limit,
    );
    return createApiResponse(
      'All of the follwoing have been fetched successfully',
      followings,
    );
  }

  @Post('follow/:id')
  async followUserController(
    @Param('id', ValidateMongooseObjectIdPipe) followingId: string,
    @User('id') userId: string,
  ) {
    const followed = await this.followerService.followUserService(
      userId,
      followingId,
    );

    return createApiResponse(
      'You have sent the follow request to the user successfully',
      followed,
    );
  }

  @Post('unfollow/:id')
  async unFollowUserController(
    @Param('id', ValidateMongooseObjectIdPipe) followingId: string,
    @User('id') userId: string,
  ) {
    const unfollowed = await this.followerService.unFollowUserService(
      userId,
      followingId,
    );

    return createApiResponse(
      'You have unfollowed the user successfully',
      unfollowed,
    );
  }

  @Post('accept/:followRequestId')
  async acceptFollowRequest(
    @Param('followRequestId', ValidateMongooseObjectIdPipe)
    requestId: string,
    @User('id') userId: string,
    @Body() acceptFollowRequestDto: AcceptFollowRequestDto,
  ) {
    const result = await this.followerService.acceptFollowRequest(
      userId,
      requestId,
      acceptFollowRequestDto,
    );
    return createApiResponse('Follow request accepted', result);
  }

  @Post('reject/:followRequestId')
  async rejectFollowRequest(
    @Param('followRequestId', ValidateMongooseObjectIdPipe)
    requestId: string,
    @User('id') userId: string,
    @Body() rejectFollowRequestDto: RejectFollowRequestDto,
  ) {
    const result = await this.followerService.rejectFollowRequest(
      userId,
      requestId,
      rejectFollowRequestDto,
    );
    return createApiResponse('Follow request rejected', result);
  }
}
