import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './posts.schema';
import { Model } from 'mongoose';
import { createTracing } from 'trace_events';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPostService(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<PostDocument> {
    const post = new this.postModel({ ...createPostDto, author: userId });
    return await post.save();
  }

  async findAllPostService(): Promise<PostDocument[]> {
    const posts = await this.postModel.find();
    return posts;
  }

  async findOnePostService(id: string): Promise<PostDocument> {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException("The post with that id isn't found");
    }
    return post;
  }

  async updatePostService(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostDocument> {
    const toBeUpatedPost = await this.postModel.findById(postId);
    if (!toBeUpatedPost) throw new NotFoundException('No such post found');
    if (toBeUpatedPost.author.toString() !== userId)
      throw new ForbiddenException("You aren't the author of the post");
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      updatePostDto,
      { new: true },
    );
    if (!updatedPost) throw new NotFoundException('No such post found');
    return updatedPost;
  }

  async deletePostService(
    userId: string,
    postId: string,
  ): Promise<PostDocument> {
    const toBeDeletedPost = await this.postModel.findById(postId);
    if (!toBeDeletedPost) throw new NotFoundException(`No such Post found`);
    if (toBeDeletedPost.author.toString() !== userId)
      throw new ForbiddenException("You aren't allowed to delete the post");
    const deletedPost = await this.postModel.findByIdAndDelete(postId);
    if (!deletedPost) throw new NotFoundException('NO such post found');
    return deletedPost;
  }
}
