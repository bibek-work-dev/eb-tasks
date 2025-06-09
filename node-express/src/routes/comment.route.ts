import express from "express";

import * as commentController from "../controllers/comment.controller";
import requireAuth from "../middlewares/requireAuth";

const commentRoutes = express.Router();

commentRoutes.get(
  "/get-for-post/:postId",
  commentController.getCommentsController
);
commentRoutes.post(
  "/create/:postId",
  requireAuth,
  commentController.createCommentController
);
commentRoutes.put(
  "/update/:commentId",
  requireAuth,
  commentController.updateCommentController
);
commentRoutes.delete(
  "/delete/:commentId",
  requireAuth,
  commentController.deleteCommentController
);

export default commentRoutes;
