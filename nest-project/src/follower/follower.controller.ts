import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { ValidateMongooseObjectIdPipe } from 'src/common/pipes/validate.mongoose.object-id/validate.mongoose.object-id.pipe';
import { User } from 'src/common/decorators/user/user.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { createApiResponse } from 'src/common/utils/response';

@Controller('follower')
@UseGuards(AuthGuard)
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Get('followers/me')
  async getMyFollowers(@User('id') userId: string) {
    const followers =
      await this.followerService.findAllFollowersService(userId);
    return createApiResponse('Your followers have been fetched', followers);
  }

  @Get('following/me')
  async getMyFollowings(@User('id') userId: string) {
    const following =
      await this.followerService.findAllFollowingService(userId);
    return createApiResponse('Your followings have been fetched', following);
  }

  @Get('followers/:id')
  async findAllFollowersController(
    @Param('id', ValidateMongooseObjectIdPipe) userId: string,
  ) {
    const followers =
      await this.followerService.findAllFollowersService(userId);
    return createApiResponse(
      'All of you followers have been fetched successfully',
      followers,
    );
  }

  @Get('following/:id')
  async findAllFollowingsController(
    @Param('id', ValidateMongooseObjectIdPipe) userId: string,
  ) {
    const followings =
      await this.followerService.findAllFollowingService(userId);
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
    console.log('usersId and followingId', userId, followingId);
    const followed = await this.followerService.followUserService(
      userId,
      followingId,
    );
    console.log('response in controller', followed);

    return createApiResponse(
      'You have followed the user successfully',
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
}
