import FollowerModel from "../models/followers.model";
import UserModel from "../models/user.model";
import { ConflictError, NotFoundError } from "../utils/ErrorHandler";
import {
  typeRespondToFollowRequestSchema,
  typeSendFollowRequestSchema,
} from "../utils/validations/followerValidationSchema";

export const getFollowersService = async (
  page: number,
  limit: number,
  followingId: string
) => {
  const user = await UserModel.findById(followingId);
  if (!user) {
    throw new NotFoundError("No such user exists");
  }
  const followers = await FollowerModel.find({
    followingId,
    status: "ACCEPTED",
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("followerId", "name email");

  if (!followers) {
    throw new NotFoundError("No such user exists");
  }
  return followers;
};

export const getMyFollowRequestsService = async (
  page: number,
  limit: number,
  userId: string
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundError("No such user exists");
  }
  const followRequests = await FollowerModel.find({
    followingId: userId,
    status: "REQUESTED",
  }).populate("followerId", "name email");

  if (!followRequests) {
    throw new NotFoundError("No follow requests found");
  }

  return followRequests;
};

export const sendFollowRequestService = async (
  userId: string,
  data: typeSendFollowRequestSchema
) => {
  const { followingId } = data;

  if (userId === followingId) {
    throw new ConflictError("You cannot follow yourself");
  }

  const user = await UserModel.findById(followingId);
  if (!user) {
    throw new NotFoundError("No such user exists");
  }

  const existingRequest = await FollowerModel.findOne({
    followerId: userId,
    followingId,
  });

  if (existingRequest) {
    throw new ConflictError("Follow request already exists");
  }

  const newFollowRequest = new FollowerModel({
    followerId: userId,
    followingId,
  });

  await newFollowRequest.save();

  return newFollowRequest;
};

export const respondToFollowRequestService = async (
  userId: string,
  followRequestId: string,
  data: typeRespondToFollowRequestSchema
) => {
  const { followerId, status } = data;
  console.log(
    "userId in respondToFollowRequestService",
    userId,
    followerId,
    status
  );
  if (userId === followerId) {
    throw new ConflictError("You cannot respond to your own follow request");
  }
  const followRequest = await FollowerModel.findById(followRequestId);
  console.log("followRequest in respondToFollowRequestService", followRequest);
  // followingId: userId,
  // followerId,
  if (!followRequest) {
    throw new NotFoundError("Follow request not found");
  }
  if (followRequest.followingId.toString() !== userId) {
    throw new ConflictError("You can only respond to your own follow requests");
  }
  if (followRequest.followerId.toString() !== followerId) {
    throw new ConflictError("Invalid follower ID");
  }
  if (status === "ACCEPTED") {
    followRequest.status = "ACCEPTED";
  } else if (status === "REJECTED") {
    followRequest.status = "REJECTED";
  } else {
    throw new ConflictError("Invalid status");
  }
  console.log(
    "followRequest in respondToFollowRequestService after mutation",
    followRequest
  );
  await followRequest.save();
  // increment the follower count oif the user being followed if status is ACCEPTED
  if (status === "ACCEPTED") {
    await UserModel.findByIdAndUpdate(
      followerId,
      { $inc: { followingCount: 1 } },
      { new: true }
    );
    await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { followersCount: 1 } },
      { new: true }
    );
  }
  return followRequest;
};
