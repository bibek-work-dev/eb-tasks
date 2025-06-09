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
      data: comments,
      message: "Comments fetched successfully",
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
      data: comment,
      message: "Comment created successfully",
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
    const updated = await commentService.updateCommentService(
      userId,
      commentId,
      req.body
    );
    res.status(200).json({
      success: true,
      data: updated,
      message: "Comment updated successfully",
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
      data: deletedComment,
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    next(error);
  }
};
