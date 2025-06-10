import { Request, Response, NextFunction } from "express";
import * as likeService from "../services/like.service";

export const likePostController = async (
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    const result = await likeService.likePostService(userId, postId);
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getLikesController = async (
  req: Request<{ postId: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const result = await likeService.getLikesService(postId);
    res.status(200).json({
      success: true,
      message: "Likes fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
