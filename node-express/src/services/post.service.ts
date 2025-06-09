import PostModel from "../models/post.model";
import { ForbiddenError, NotFoundError } from "../utils/ErrorHandler";
import {
  typeCreatePostSchema,
  typeUpdatePostSchema,
} from "../utils/validations/postvalidationSchema";

export const getPostService = async (postId: string) => {
  console.log("Fetching post with ID:", postId);
  const post = await PostModel.findById(postId);
  console.log("Post fetched:", post);
  if (!post) {
    throw new NotFoundError("Post not found");
  }
  return post;
};

export const getAllPostsService = async (page: number, limit: number) => {
  console.log("Fetching all posts");
  const posts = await PostModel.find({})
    .skip((page - 1) * limit)
    .limit(limit);
  console.log("All posts fetched:", posts);
  return posts;
};

export const createPostService = async (
  userId: string,
  data: typeCreatePostSchema
) => {
  return PostModel.create({ ...data, userId });
};

export const updatePostService = async (
  userId: string,
  postId: string,
  data: typeUpdatePostSchema
) => {
  console.log("Updating post with ID:", postId);
  const post = await PostModel.findById(postId);
  console.log("Post updated:", post);
  if (!post) {
    throw new NotFoundError("Post not found");
  }
  if (post.userId.toString() !== userId) {
    throw new ForbiddenError("You are not authorized to update this post");
  }
  const updatedPost = await PostModel.findByIdAndUpdate(
    postId,
    { $set: data },
    { new: true }
  );
  console.log("Post after update:", updatedPost);
  if (!updatedPost) {
    throw new NotFoundError("Post not found after update");
  }
  return updatedPost;
};

export const deletePostService = async (userId: string, postId: string) => {
  console.log("Deleting post with ID:", userId, postId);

  const post = await PostModel.findById(postId);
  console.log("Post deleted:", post);

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  if (post?.userId.toString() !== userId) {
    throw new ForbiddenError("You are not authorized to delete this post");
  }

  await PostModel.findByIdAndDelete(postId);

  return post;
};
