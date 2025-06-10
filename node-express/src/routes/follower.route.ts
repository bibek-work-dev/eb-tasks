import express from "express";

const followerRoutes = express.Router();

import * as followerController from "../controllers/follower.controller";

import requireAuth from "../middlewares/requireAuth";
import { zodValidate } from "../middlewares/zodValidation";
import {
  respondToFollowRequestSchema,
  sendFollowRequestSchema,
} from "../utils/validations/followerValidationSchema";

followerRoutes.get(
  "/get-followers/:followingId",
  followerController.getFollowersController
);

followerRoutes.patch(
  "/send-follow-request",
  requireAuth,
  zodValidate(sendFollowRequestSchema),
  followerController.sendFollowRequestController
);

followerRoutes.patch(
  "/respond-to-follow-request/:followRequestId",
  requireAuth,
  zodValidate(respondToFollowRequestSchema),
  followerController.respondToFollowRequestController
);

export default followerRoutes;
