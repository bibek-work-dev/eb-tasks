import express from "express";

const postRoutes = express.Router();

import * as postController from "../controllers/post.controller";
import { zodValidate } from "../middlewares/zodValidation";
import {
  createPostSchema,
  updatePostSchema,
} from "../utils/validations/postvalidationSchema";
import requireAuth from "../middlewares/requireAuth";

postRoutes.get("/get/:postId", postController.getPostController);
postRoutes.get("/get-all", postController.getAllPostsController);
postRoutes.post(
  "/create",

  zodValidate(createPostSchema),
  requireAuth,
  postController.createPostController
);
postRoutes.patch(
  "/update/:postId",
  zodValidate(updatePostSchema),
  requireAuth,
  postController.updatePostController
);
postRoutes.delete(
  "/delete/:postId",
  requireAuth,
  postController.deletePostController
);

export default postRoutes;
