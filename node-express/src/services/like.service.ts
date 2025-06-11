import LikeModel from "../models/like.model";
import PostModel from "../models/post.model";
import { NotFoundError } from "../utils/ErrorHandler";

export const likePostService = async (userId: string, postId: string) => {
  const post = await PostModel.findById(postId);
  if (!post) throw new NotFoundError("Post Not Found");
  const existing = await LikeModel.findOne({ userId, postId });
  if (existing) {
    await LikeModel.deleteOne({ userId, postId });
    post.noOfLikes -= 1;
    await post.save();
    return { message: "Like removed successfully", likeCount: post.noOfLikes };
  } else {
    const like = await LikeModel.create({ userId, postId });
    if (!like) {
      throw new NotFoundError("Post not found");
    }
    post.noOfLikes += 1;
    await post.save();
    return {
      message: "Post Liked successfully",
      likeCount: post.noOfLikes,
    };
  }
};

export const getLikesService = async (postId: string) => {
  const post = await PostModel.findById(postId);
  if (!post) throw new NotFoundError("Post Not Found");
  const likes = await LikeModel.find({ postId }).populate(
    "userId",
    "name email"
  );
  const noOfLikes = await LikeModel.countDocuments({ postId });
  return { noOfLikes, likes };
};
