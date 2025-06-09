import { NextFunction, Request, Response } from "express";
import * as postService from "../services/post.service";
import {
  typeCreatePostSchema,
  typeUpdatePostSchema,
} from "../utils/validations/postvalidationSchema";

export const getPostController = async (
  req: Request<{ postId: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.postId;
    const post = await postService.getPostService(postId);
    res.status(200).json({
      success: true,
      data: post,
      message: "Post fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPostsController = async (
  req: Request<{}, {}, {}, { page: string; limit: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    console.log("page", page, "limit", limit);
    const posts = await postService.getAllPostsService(page, limit);
    res.status(200).json({
      success: true,
      data: posts,
      message: "All posts fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createPostController = async (
  req: Request<{}, {}, typeCreatePostSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;

    const data = req.body;
    console.log("data", data), userId;
    const post = await postService.createPostService(userId, data);
    res.status(201).json({
      success: true,
      data: post,
      message: "Post created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePostController = async (
  req: Request<{ postId: string }, {}, typeUpdatePostSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.postId;
    const data = req.body;
    const userId = req.user.userId;
    console.log("postId", postId, "data", data, "userId", userId);
    const post = await postService.updatePostService(userId, postId, data);
    res.status(200).json({
      success: true,
      data: post,
      message: "Post updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deletePostController = async (
  req: Request<{ postId: string }, {}, typeCreatePostSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;
    const post = await postService.deletePostService(userId, postId);
    res.status(200).json({
      success: true,
      data: post,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
