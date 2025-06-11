import { NextFunction, Request, Response } from "express";
import * as followerService from "../services/follower.service";
import {
  typeRespondToFollowRequestSchema,
  typeSendFollowRequestSchema,
} from "../utils/validations/followerValidationSchema";

export const getFollowersController = async (
  req: Request<
    { followingId: string },
    {},
    {},
    { limit?: string; page?: string }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { followingId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;

    console.log("followingId in get followers controller", followingId);
    const result = await followerService.getFollowersService(
      page,
      limit,
      followingId
    );
    console.log("result in get followers controller", result);
    res.status(200).json({
      success: true,
      message: "Followers fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyFollowRequestsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await followerService.getMyFollowRequestsService(
      page,
      limit,
      userId
    );
    console.log("result in get follow requests controller", result);
    res.status(200).json({
      success: true,
      message: "Follow requests fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const sendFollowRequestController = async (
  req: Request<{}, {}, typeSendFollowRequestSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const result = await followerService.sendFollowRequestService(
      userId,
      req.body
    );
    console.log("result in send follower request controller", result);
    res.status(200).json({
      success: true,
      message: "Follow request sent successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const respondToFollowRequestController = async (
  req: Request<
    { followRequestId: string },
    {},
    typeRespondToFollowRequestSchema
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const { followRequestId } = req.params;
    const result = await followerService.respondToFollowRequestService(
      userId,
      followRequestId,
      req.body
    );
    console.log("result in responsd to follower request controller", result);
    res.status(200).json({
      success: true,
      message: "Follow request response sent successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
