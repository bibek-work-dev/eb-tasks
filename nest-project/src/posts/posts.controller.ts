import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { User } from 'src/common/decorators/user/user.decorator';
import { createApiResponse } from 'src/common/utils/response';
import { ApiResponse } from 'src/common/types/response';
import { PostDocument } from './posts.schema';
import { ValidateMongooseObjectIdPipe } from 'src/common/pipes/validate.mongoose.object-id/validate.mongoose.object-id.pipe';
import { CommentDocument } from 'src/comments/comments.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.config';

type PostResponse<T> = Promise<ApiResponse<T>>;

@Controller('posts')
@UseGuards(AuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async createPostController(
    @UploadedFile() image: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @User('id') userId: string,
    @User('name') authorName: string,
  ): PostResponse<PostDocument> {
    console.log('In create', userId, authorName);
    const post = await this.postsService.createPostService(
      userId,
      authorName,
      createPostDto,
      image,
    );
    return createApiResponse('Post Created successfully', post);
  }

  @Get()
  async findAllPostController(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<
    PostResponse<{ posts: PostDocument[]; page: number; total: number }>
  > {
    const { posts, total } = await this.postsService.findAllPostService(
      page,
      limit,
    );
    return createApiResponse('All posts fetched successfully', {
      total,
      page,
      posts,
    });
  }

  @Get(':id/comments')
  async findPostCommentsController(
    @Param('id', ValidateMongooseObjectIdPipe) postId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<
    PostResponse<{ comments: CommentDocument[]; total: number; page: number }>
  > {
    const { comments, total } = await this.postsService.findPostCommentsService(
      postId,
      page,
      limit,
    );
    return createApiResponse('Comments fetched successfully', {
      total,
      page,
      comments,
    });
  }

  @Get(':id')
  async findOnePostController(
    @Param('id', ValidateMongooseObjectIdPipe) postId: string,
  ): PostResponse<PostDocument> {
    const post = await this.postsService.findOnePostService(postId);
    return createApiResponse('Post Fetched successfully', post);
  }

  @Patch(':id')
  async updatePostController(
    @Param('id', ValidateMongooseObjectIdPipe) postId: string,
    @User('id') userId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): PostResponse<PostDocument> {
    console.log('updatePsotDto', updatePostDto);
    const updatedPost = await this.postsService.updatePostService(
      userId,
      postId,
      updatePostDto,
    );
    return createApiResponse('Post Updated Successfully', updatedPost);
  }

  @Delete(':id')
  async deletePostController(
    @Param('id', ValidateMongooseObjectIdPipe) postId: string,
    @User('id') userId: string,
  ): PostResponse<PostDocument> {
    const deletedPost = await this.postsService.deletePostService(
      userId,
      postId,
    );
    return createApiResponse('Post Deleted Successfully', deletedPost);
  }
}
