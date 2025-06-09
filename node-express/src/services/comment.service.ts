import CommentModel from "../models/comment.model";
import { InternalSeverError, NotFoundError } from "../utils/ErrorHandler";
import {
  typeCreateCommentInput,
  typeUpdateCommentInput,
} from "../utils/validations/commentValidationSchema";

export const getCommentsService = async (postId: string) => {
  const comments = await CommentModel.find({ postId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  if (!comments) {
    throw new NotFoundError("Comments not found for this post");
  }
  return comments;
};

export const createCommentService = async (
  userId: string,
  postId: string,
  data: typeCreateCommentInput
) => {
  console.log(
    "Creating comment for postId:",
    postId,
    "by userId:",
    userId,
    data
  );
  const comment = await CommentModel.create({
    ...data,
    postId,
    userId,
  });

  if (!comment) {
    throw new InternalSeverError();
  }
  return comment;
};

export const updateCommentService = async (
  userId: string,
  commentId: string,
  data: typeUpdateCommentInput
) => {
  const updatedComment = await CommentModel.findById(commentId);
  if (!updatedComment) {
    throw new NotFoundError("Comment not found");
  }
  if (updatedComment.userId.toString() !== userId) {
    throw new NotFoundError(
      "You do not have permission to update this comment"
    );
  }
  updatedComment.content = data.content;
  await updatedComment.save();
  if (!updatedComment) {
    throw new InternalSeverError();
  }
  return updatedComment;
};

export const deleteCommentService = async (
  userId: string,
  commentId: string
) => {
  const comment = await CommentModel.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  if (comment.userId.toString() !== userId) {
    throw new NotFoundError(
      "You do not have permission to delete this comment"
    );
  }

  const deletedComment = await CommentModel.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new InternalSeverError();
  }
  return deletedComment;
};
