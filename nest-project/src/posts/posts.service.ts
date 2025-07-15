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
import { Comment, CommentDocument } from 'src/comments/comments.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async createPostService(
    userId: string,
    authorName,
    createPostDto: CreatePostDto,
  ): Promise<PostDocument> {
    const post = new this.postModel({
      ...createPostDto,
      authorName,
      authorId: userId,
    });
    return await post.save();
  }

  async findAllPostService(): Promise<PostDocument[]> {
    const posts = await this.postModel.find();
    return posts;
  }

  async findPostCommentsService(postId: string): Promise<CommentDocument[]> {
    const posts = await this.postModel.findById(postId);
    if (!posts) throw new NotFoundException('No such Post found');
    const comments = await this.commentModel.find({ postId: postId });
    return comments;
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
    await this.ensurePostOwnership(toBeUpatedPost, userId);
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
    await this.ensurePostOwnership(toBeDeletedPost, userId);
    const deletedPost = await this.postModel.findByIdAndDelete(postId);
    if (!deletedPost) throw new NotFoundException('NO such post found');
    return deletedPost;
  }

  ensurePostOwnership(post: PostDocument, userId: string): PostDocument {
    if (post.authorId.toString() !== userId)
      throw new ForbiddenException("You aren't allowed to mutate this post");
    return post;
  }
}
