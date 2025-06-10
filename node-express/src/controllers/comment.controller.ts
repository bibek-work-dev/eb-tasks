import { NextFunction, Request, Response } from "express";

import * as commentService from "../services/comment.service";
import {
  typeCreateCommentInput,
  typeUpdateCommentInput,
} from "../utils/validations/commentValidationSchema";

export const getCommentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const comments = await commentService.getCommentsService(postId);
    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: comments,
    });
  } catch (error: any) {
    next(error);
  }
};

export const createCommentController = async (
  req: Request<{ postId: string }, {}, typeCreateCommentInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    const comment = await commentService.createCommentService(
      userId,
      postId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateCommentController = async (
  req: Request<{ commentId: string }, {}, typeUpdateCommentInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;
    console.log("Updating comment with ID:", commentId, "by userId:", userId);
    const updated = await commentService.updateCommentService(
      userId,
      commentId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: updated,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteCommentController = async (
  req: Request<{ commentId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;
    const deletedComment = await commentService.deleteCommentService(
      userId,
      commentId
    );
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: deletedComment,
    });
  } catch (error: any) {
    next(error);
  }
};
