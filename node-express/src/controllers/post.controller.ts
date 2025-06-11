import { NextFunction, Request, Response } from "express";
import * as postService from "../services/post.service";
import {
  typeCreatePostSchema,
  typeUpdatePostSchema,
} from "../utils/validations/postvalidationSchema";
export interface UploadRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  file?: Express.Multer.File; // optional banaye eslai
}

export const getPostController = async (
  req: Request<{ postId: string }, {}, {}, { comment?: string }>,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.postId;
  const noOfComments = parseInt(req.query.comment as string) || 3;

  // const filePath = path.join(__dirname, "..", "..", "uploads");

  // if (!fs.existsSync(filePath)) {
  //   fs.mkdirSync(filePath, { recursive: true });
  // }
  // const fileName = `${postId}.txt`;
  // const filePathWithName = path.join(filePath, fileName);

  // const writeAbleStream = fs.createWriteStream(filePathWithName);

  // res.pipe(writeAbleStream);

  // writeAbleStream.on("finish", async () => {
  try {
    const post = await postService.getPostService(postId, noOfComments);
    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error: any) {
    next(error);
  }
  // });
  // writeAbleStream.on("error", (error: any) => {
  //   console.error("Error writing to file:", error);
  //   next(error);
  // });
};

export const getAllPostsController = async (
  req: Request<{}, {}, {}, { page?: string; limit?: string; search?: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page || "1") || 1;
    const limit = parseInt(req.query.limit || "10") || 10;

    const search = req.query.search || "";
    console.log("page", page, "limit", limit);
    const posts = await postService.getAllPostsService(page, limit, search);
    res.status(200).json({
      success: true,
      message: "All posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserHomeFeedController = async (
  req: Request<{}, {}, {}, { page?: string; limit?: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const feeds = await postService.getUserHomeFeedService(userId, page, limit);
    res.status(200).json({
      success: true,
      message: "Feeds fetched successfully",
      data: feeds,
    });
  } catch (error) {
    next(error);
  }
};

type typeUpdatedCreatedPostSchema = typeCreatePostSchema & {
  imageUrl?: string;
};

export const createPostController = async (
  req: UploadRequest<{}, {}, typeUpdatedCreatedPostSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const data = req.body;
    const file = req.file;
    console.log("file", file);
    if (file) {
      data.imageUrl = file.path;
    } else {
      data.imageUrl = "";
    }
    console.log("data", data, userId);
    const post = await postService.createPostService(userId, data);
    console.log("post", post);
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log("error");
    next(error);
  }
};

type typeUpdatedUpdatePostSchema = typeUpdatePostSchema & {
  imageUrl?: string;
};

export const updatePostController = async (
  req: Request<{ postId: string }, {}, typeUpdatedUpdatePostSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.postId;
    const data = req.body;
    const userId = req.user.userId;
    console.log("postId", postId, "data", data, "userId", userId);
    const file = req.file;
    if (file) {
      data.imageUrl = file.path;
    }
    const post = await postService.updatePostService(userId, postId, data);
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePostController = async (
  req: Request<{ postId: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;
    const post = await postService.deletePostService(userId, postId);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
