import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLikeDislikeDto } from './dto/create-like-dislike.dto';
import { UpdateLikeDislikeDto } from './dto/update-like-dislike.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  LikeDislike,
  LikeDislikeDocument,
  LikeDislikeSchema,
} from './like-dislike.schema';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../posts.schema';

@Injectable()
export class LikeDislikeService {
  constructor(
    @InjectModel(LikeDislike.name)
    private LikeDislikeMode: Model<LikeDislikeDocument>,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
  ) {}

  async checkUserLikeStatus(postId: string, userId: string): Promise<boolean> {
    const like = await this.LikeDislikeMode.findOne({ postId, userId });
    return like?.isLike || false;
  }

  async likeOrDislikeService(
    userId: string,
    postId: string,
  ): Promise<LikeDislikeDocument> {
    const post = await this.PostModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.LikeDislikeMode.findOne({ postId, userId });

    if (existing) {
      existing.isLike = !existing.isLike;
      await existing.save();

      const change = existing.isLike ? 1 : -1;
      await this.PostModel.findByIdAndUpdate(postId, {
        $inc: { noOfLikes: change },
      });

      return existing;
    }

    const newLike = new this.LikeDislikeMode({ postId, userId, isLike: true });
    await newLike.save();

    await this.PostModel.findByIdAndUpdate(postId, {
      $inc: { noOfLikes: 1 },
    });

    return newLike;
  }

  async removeLikeOrDislikeService(
    userId: string,
    postId: string,
  ): Promise<LikeDislikeDocument> {
    const removed = await this.LikeDislikeMode.findOneAndDelete({
      postId,
      userId,
    });
    if (!removed) {
      throw new NotFoundException('You have no feedback here');
    }

    await this.PostModel.findByIdAndUpdate(postId, {
      $inc: { noOfLikes: removed.isLike ? -1 : 0 },
    });

    return removed;
  }
}
