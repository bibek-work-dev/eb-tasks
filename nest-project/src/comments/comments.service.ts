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
      throw new NotFoundException('No such comment found');
    await this.ensureCommentOwnerShip(toBeDeletedComment, userId);
    await this.commentModel.findByIdAndDelete(commentId);
    return toBeDeletedComment;
  }

  ensureCommentOwnerShip(comment: CommentDocument, userId: string): any {
    if (comment.authorId.toString() !== userId) {
      throw new ForbiddenException("You aren't allowed to mutate the comment");
    }
    return comment;
  }
}
