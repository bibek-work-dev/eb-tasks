import { Router } from "express";
import requireAuth from "../middlewares/requireAuth";

import * as notificationController from "../controllers/notification.controller";

const notificationRoutes = Router();

notificationRoutes.get(
  "/post-notification",
  requireAuth,
  notificationController.getPostNotificationController
);
notificationRoutes.get(
  "/follow-request-notification",
  requireAuth,
  notificationController.getFollowRequestNotificationController
);

export default notificationRoutes;
