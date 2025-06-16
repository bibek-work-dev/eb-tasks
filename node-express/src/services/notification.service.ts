import NotificationModel from "../models/notifications.model";

export const getPostNotifications = async (
  userId: string,
  type?: string,
  currentPage: number = 1,
  currentLimit: number = 10
) => {
  const query: any = {
    recipient: userId,
    type: { $in: ["LIKE", "COMMENT"] },
  };

  if (type) {
    query.type = type.toUpperCase();
  }

  const total = await NotificationModel.countDocuments(query);

  const notifications = await NotificationModel.find(query)
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * currentLimit)
    .limit(currentLimit)
    .populate("sender", "name")
    .populate("postId", "title");

  return {
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages: Math.ceil(total / currentLimit),
    notifications,
  };
};

export const getFollowRequestNotifications = async (
  userId: string,
  currentPage: number = 1,
  currentLimit: number = 10
) => {
  const query = {
    recipient: userId,
    type: "FOLLOW_REQUEST",
  };

  const total = await NotificationModel.countDocuments(query);

  const notifications = await NotificationModel.find(query)
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * currentLimit)
    .limit(currentLimit)
    .populate("sender", "name");

  return {
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages: Math.ceil(total / currentLimit),
    notifications,
  };
};
