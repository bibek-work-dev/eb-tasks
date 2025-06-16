import { Request, Response, NextFunction } from "express";
import * as notificationService from "../services/notification.service";

export const getPostNotificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const { type, page = "1", limit = "10" } = req.query;

    const currentPage = parseInt(page as string) || 1;
    const currentLimit = parseInt(limit as string) || 10;

    const notifications = await notificationService.getPostNotifications(
      userId,
      type as string,
      currentPage,
      currentLimit
    );

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

export const getFollowRequestNotificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const { page = "1", limit = "10" } = req.query;

    const currentPage = parseInt(page as string) || 1;
    const currentLimit = parseInt(limit as string) || 10;

    const notifications =
      await notificationService.getFollowRequestNotifications(
        userId,
        currentPage,
        currentLimit
      );

    res.status(200).json({
      success: true,
      message: "The follow requests have been fetched",
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};
