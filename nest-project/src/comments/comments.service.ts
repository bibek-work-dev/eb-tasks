import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './comments.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async createCommentService(
    userId,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentDocument> {
    const createdComment = await this.commentModel.create({
      ...createCommentDto,
      authorId: userId,
    });
    return createdComment;
  }

  async findAllCommmentService(): Promise<CommentDocument[]> {
    const comments = await this.commentModel.find();
    return comments;
  }

  async findOneCommentsService(commentId: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Not such Post found');
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
    const toBeDeletedComment = await this.commentModel.findOneAndDelete({
      authorId: userId,
      _id: commentId,
    });
    if (!toBeDeletedComment)
      throw new NotFoundException('No such comment found');
    return toBeDeletedComment;
  }
}
