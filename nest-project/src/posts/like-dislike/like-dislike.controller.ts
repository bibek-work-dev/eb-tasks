import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LikeDislikeService } from './like-dislike.service';
import { User } from 'src/common/decorators/user/user.decorator';
import { createApiResponse } from 'src/common/utils/response';
import { ApiResponse } from 'src/common/types/response';
import { ValidateMongooseObjectIdPipe } from 'src/common/pipes/validate.mongoose.object-id/validate.mongoose.object-id.pipe';
import { LikeDislikeDocument } from './like-dislike.schema';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Controller('posts/:postId')
@UseGuards(AuthGuard)
export class LikeDislikeController {
  constructor(private readonly likeDislikeService: LikeDislikeService) {}

  @Get('like-status')
  async getLikeStatus(
    @Param('postId', ValidateMongooseObjectIdPipe) postId: string,
    @User('id') userId: string,
  ): Promise<ApiResponse<{ liked: boolean }>> {
    const existing = await this.likeDislikeService.checkUserLikeStatus(
      postId,
      userId,
    );
    return createApiResponse('Status retrieved', { liked: existing });
  }

  @Post('like-toggle')
  async likeOrDislikeController(
    @Param('postId', ValidateMongooseObjectIdPipe) postId: string,
    @User('id') userId: string,
  ): Promise<ApiResponse<LikeDislikeDocument>> {
    const likeOrDisliked = await this.likeDislikeService.likeOrDislikeService(
      userId,
      postId,
    );
    if (likeOrDisliked.isLike) {
      return createApiResponse('Liked', likeOrDisliked);
    } else {
      return createApiResponse('Disliked', likeOrDisliked);
    }
  }

  @Delete('delete')
  async removeLikeorDislikeController(
    @Param('postId', ValidateMongooseObjectIdPipe) postId: string,
    @User('id') userId: string,
  ): Promise<ApiResponse<LikeDislikeDocument>> {
    const removed = await this.likeDislikeService.removeLikeOrDislikeService(
      postId,
      userId,
    );
    console.log('Here', removed);
    return createApiResponse('Feedback removed successfully', removed);
  }
}
