import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/common/decorators/user/user.decorator';
import { createApiResponse } from 'src/common/utils/response';
import { ApiResponse } from 'src/common/types/response';
import { CommentDocument } from './comments.schema';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { ValidateMongooseObjectIdPipe } from 'src/common/pipes/validate.mongoose.object-id/validate.mongoose.object-id.pipe';

type CommentResponse<T> = Promise<ApiResponse<T>>;

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':id')
  async create(
    @Param('id', ValidateMongooseObjectIdPipe) postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @User('id') userId: string,
    @User('name') authorName: string,
  ): CommentResponse<CommentDocument> {
    const comment = await this.commentsService.createCommentService(
      userId,
      authorName,
      postId,
      createCommentDto,
    );
    return createApiResponse('Comment created successfully', comment);
  }

  @Get()
  async findAll(): CommentResponse<CommentDocument[]> {
    const comments = await this.commentsService.findAllCommmentService();
    console.log('comments', comments);
    return createApiResponse('Comments fetched successfully', comments);
  }

  @Get(':id')
  async findOne(
    @Param('id', ValidateMongooseObjectIdPipe) postId: string,
  ): CommentResponse<CommentDocument> {
    const comment = await this.commentsService.findOneCommentsService(postId);
    return createApiResponse('Comment fetched successfully', comment);
  }

  @Patch(':id')
  async update(
    @Param('id', ValidateMongooseObjectIdPipe) commentId: string,
    @User('id') userId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): CommentResponse<CommentDocument> {
    const comment = await this.commentsService.updateCommentService(
      userId,
      commentId,
      updateCommentDto,
    );
    return createApiResponse('Comment updated successfully', comment);
  }

  @Delete(':id')
  async remove(
    @Param('id', ValidateMongooseObjectIdPipe) commentId: string,
    @User('id') userId: string,
  ): CommentResponse<CommentDocument> {
    const comment = await this.commentsService.deleteCommentService(
      userId,
      commentId,
    );
    return createApiResponse('Comment deleted successfully', comment);
  }
}
