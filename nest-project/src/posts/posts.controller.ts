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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { User } from 'src/common/decorators/user/user.decorator';
import { createApiResponse } from 'src/common/utils/response';
import { ApiResponse } from 'src/common/types/response';
import { PostDocument } from './posts.schema';

type PostResponse<T> = Promise<ApiResponse<T>>;

@Controller('posts')
@UseGuards(AuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPostController(
    @Body() createPostDto: CreatePostDto,
    @User('id') userId: string,
  ): PostResponse<PostDocument> {
    const post = await this.postsService.createPostService(
      userId,
      createPostDto,
    );
    return createApiResponse('Post Created successfully', post);
  }

  @Get()
  async findAllPostController(): PostResponse<PostDocument[]> {
    const posts = await this.postsService.findAllPostService();
    return createApiResponse('All Post fetched successfully', posts);
  }

  @Get(':id')
  async findOnePostController(
    @Param('id') postId: string,
  ): PostResponse<PostDocument> {
    const post = await this.postsService.findOnePostService(postId);
    return createApiResponse('Post Fetched successfully', post);
  }

  @Patch(':id')
  async updatePostController(
    @Param('id') postId: string,
    @User('id') userId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): PostResponse<PostDocument> {
    const updatedPost = await this.postsService.updatePostService(
      userId,
      postId,
      updatePostDto,
    );
    return createApiResponse('Post Updated Successfully', updatedPost);
  }

  @Delete(':id')
  async deletePostController(
    @Param('id') postId: string,
    @User('id') userId: string,
  ): PostResponse<PostDocument> {
    const deletedPost = await this.postsService.deletePostService(
      userId,
      postId,
    );
    return createApiResponse('Post Deleted Successfully', deletedPost);
  }
}
