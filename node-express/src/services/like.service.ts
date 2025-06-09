import LikeModel from "../models/like.model";
import { ConflictError, NotFoundError } from "../utils/ErrorHandler";
export const likePostService = async (userId: string, postId: string) => {
  const existing = await LikeModel.findOne({ userId, postId });
  if (existing) throw new ConflictError("Post already liked");
  const like = await LikeModel.create({ userId, postId });
  return like;
};

export const unlikePostService = async (userId: string, postId: string) => {
  const like = await LikeModel.findOneAndDelete({ userId, postId });
  if (!like) throw new NotFoundError("Like not found");
  return true;
};

export const getLikesService = async (postId: string) => {
  const likes = await LikeModel.find({ postId }).populate(
    "userId",
    "name email"
  );
  return likes;
};
