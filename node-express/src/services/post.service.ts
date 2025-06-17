import mongoose from "mongoose";
import CommentModel from "../models/comment.model";
import FollowerModel from "../models/followers.model";
import PostModel from "../models/post.model";
import UserModel from "../models/user.model";
import {
  ForbiddenError,
  InternalSeverError,
  NotFoundError,
} from "../utils/ErrorHandler";
import {
  typeCreatePostSchema,
  typeUpdatePostSchema,
} from "../utils/validations/postvalidationSchema";

export const getPostService = async (postId: string, noOfComments: number) => {
  console.log("Fetching post with ID:", postId);
  const post: any = (
    await PostModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(postId) },
      },
    ])
  )[0];

  console.log("post in post", post);
  if (!post) {
    throw new NotFoundError("Post not found");
  }
  const comments = await CommentModel.find({ postId })
    .populate({
      path: "post",
      select: "name email",
    })
    .sort({ createdAt: -1 })
    .limit(noOfComments);
  if (!comments) {
    throw new NotFoundError("Comments not founds");
  }

  return {
    ...post._doc,
    comments: comments,
  };
};

export const getAllPostsService = async (
  page: number,
  limit: number,
  search: string
) => {
  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  console.log("Fetching all posts");

  const posts = await PostModel.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPosts = await PostModel.countDocuments();
  const totalPages = Math.ceil(totalPosts / limit);

  console.log("All posts fetched:", posts);

  return {
    posts,
    currentPage: page,
    totalPages,
    totalPosts,
  };
};

export const getUserHomeFeedService = async (
  userId: string,
  page: number,
  limit: number
) => {
  const following = await FollowerModel.find({
    followerId: userId,
    status: "ACCEPTED",
  }).select("followingId");
  console.log("following", following);
  const followingIds = following.map((f) => f.followingId);
  if (followingIds.length === 0) {
    return {
      currentPage: page,
      totalPages: 0,
      totalPosts: 0,
      posts: [],
    };
  }
  console.log("followingIds", followingIds);
  const totalPosts = await PostModel.countDocuments({
    userId: { $in: followingIds },
  });

  const totalPages = Math.ceil(totalPosts / limit);
  const posts = await PostModel.find({ userId: { $in: followingIds } });
  console.log("posts", posts);
  if (!posts) throw new NotFoundError("Something went wrong !!");
  return { currentPage: page, totalPages: totalPages, totalPosts: 0, posts };
};

export const createPostService = async (
  userId: string,
  data: typeCreatePostSchema
) => {
  console.log("data and userId in createPostService", data, userId);
  const post = PostModel.create({ ...data, userId });
  if (!post) throw new InternalSeverError();
  const noOfPostByUser = await PostModel.countDocuments({ userId });
  await UserModel.findByIdAndUpdate(userId, { postsCount: noOfPostByUser });
  return post;
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

  const noOfPostByUser = await PostModel.countDocuments({ userId });
  await UserModel.findByIdAndUpdate(userId, { postsCount: noOfPostByUser });

  return post;
};
