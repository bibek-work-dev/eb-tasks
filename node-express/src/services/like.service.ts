import LikeModel from "../models/like.model";
import { ConflictError, NotFoundError } from "../utils/ErrorHandler";
export const likePostService = async (userId: string, postId: string) => {
  const existing = await LikeModel.findOne({ userId, postId });
  if (existing) {
    await LikeModel.deleteOne({ userId, postId });
    return { message: "Like removed successfully" };
  } else {
    const like = await LikeModel.create({ userId, postId });
    if (!like) {
      throw new NotFoundError("Post not found");
    }
    const likeCount = await LikeModel.countDocuments({ postId });
    return { message: "Post Liked successfully", likeCount };
  }
};

export const getLikesService = async (postId: string) => {
  const likes = await LikeModel.find({ postId }).populate(
    "userId",
    "name email"
  );
  return likes;
};
