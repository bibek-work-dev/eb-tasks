import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './comments.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from 'src/posts/posts.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async createCommentService(
    userId: string,
    authorName: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentDocument> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('No such post found to add comment');
    const createdComment = await this.commentModel.create({
      ...createCommentDto,
      postId,
      authorId: userId,
      authorName,
    });
    const miniComment = {
      commentId: createdComment._id,
      commenterName: authorName,
      content: createCommentDto.content,
      createdAt: new Date(),
    };

    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { noOfComments: 1 },
      $push: {
        latestComments: {
          $each: [miniComment],
          $position: 0,
          $slice: 5,
        },
      },
    });

    return createdComment;
  }

  async findAllCommentService(
    page: number,
    limit: number,
  ): Promise<{ comments: CommentDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const total = await this.commentModel.countDocuments();
    const comments = await this.commentModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    return { comments, total };
  }

  async findOneCommentsService(commentId: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Not such Comment found');
    return comment;
  }

  async updateCommentService(
    userId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentDocument> {
    const toBeUpdatedComment = await this.commentModel.findById(commentId);
    if (!toBeUpdatedComment) {
      throw new NotFoundException('No such comment found');
    }
    await this.ensureCommentOwnerShip(toBeUpdatedComment, userId);
    const updatedComment = await this.commentModel.findByIdAndUpdate(
      commentId,
      updateCommentDto,
      { new: true },
    );
    if (!updatedComment) throw new NotFoundException('Something went wrong');
    return updatedComment;
  }

  async deleteCommentService(
    userId: string,
    commentId: string,
  ): Promise<CommentDocument> {
    const toBeDeletedComment = await this.commentModel.findById(commentId);
    if (!toBeDeletedComment)
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    await this.ensureCommentOwnerShip(toBeDeletedComment, userId);
    await this.commentModel.findByIdAndDelete(commentId);
    await this.postModel.findByIdAndUpdate(toBeDeletedComment.postId, {
      $pull: {
        latestComments: { commentId: toBeDeletedComment._id },
      },
      $inc: { noOfComments: -1 },
    });

    return toBeDeletedComment;
  }

  ensureCommentOwnerShip(comment: CommentDocument, userId: string): any {
    if (comment.authorId.toString() !== userId) {
      throw new ForbiddenException("You aren't allowed to mutate the comment");
    }
    return comment;
  }
}
