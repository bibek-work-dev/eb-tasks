import {
  BadRequestException,
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
import { promises as fs } from 'fs';
import path, { join } from 'node:path';
import {
  LikeDislike,
  LikeDislikeDocument,
} from './like-dislike/like-dislike.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(LikeDislike.name)
    private likeDislikeModel: Model<LikeDislikeDocument>,
  ) {}

  async createPostService(
    userId: string,
    authorName,
    createPostDto: CreatePostDto,
    image?: Express.Multer.File,
  ): Promise<PostDocument> {
    if (!image) {
      throw new BadRequestException('It is compulosory to Upload the file');
    }
    console.log('image', image);
    const imageUrl = `${image.filename}`;
    const post = new this.postModel({
      ...createPostDto,
      authorName,
      authorId: userId,
      imageUrl,
    });
    return await post.save();
  }
  async findAllPostService(
    page: number,
    limit: number,
  ): Promise<{ posts: PostDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const total = await this.postModel.countDocuments();

    const posts = await this.postModel.find().skip(skip).limit(limit).exec();

    return { posts, total };
  }

  async findPostCommentsService(
    postId: string,
    page: number,
    limit: number,
  ): Promise<{ comments: CommentDocument[]; total: number }> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('No such Post found');

    const skip = (page - 1) * limit;
    const total = await this.commentModel.countDocuments({ postId });
    const comments = await this.commentModel
      .find({ postId })
      .skip(skip)
      .limit(limit)
      .exec();

    return { comments, total };
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
    console.log('deletedPost', deletedPost);
    if (!deletedPost) throw new NotFoundException('NO such post found');
    const imagePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      deletedPost.imageUrl,
    );
    try {
      await fs.unlink(imagePath);
      console.log('Image file deleted:', imagePath);
    } catch (err) {
      console.error('Failed to delete image file:', imagePath, err.message);
      // You might choose to continue even if the image doesn't exist
    }
    this.commentModel.deleteMany({ postId }).catch((err) => {
      console.error('Failed to delete comments for post:', postId, err.message);
    });

    this.likeDislikeModel.deleteMany({ postId }).catch((err) => {
      console.log('Faile to delete the like Dislike comments for post');
    });

    return deletedPost;
  }

  ensurePostOwnership(post: PostDocument, userId: string): PostDocument {
    if (post.authorId.toString() !== userId)
      throw new ForbiddenException("You aren't allowed to mutate this post");
    return post;
  }
}
