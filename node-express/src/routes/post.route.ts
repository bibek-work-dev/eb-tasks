import express from "express";

const postRoutes = express.Router();

import * as postController from "../controllers/post.controller";
import { zodValidate } from "../middlewares/zodValidation";
import {
  createPostSchema,
  updatePostSchema,
} from "../utils/validations/postvalidationSchema";
import requireAuth from "../middlewares/requireAuth";
import upload from "../middlewares/multerConfig";

postRoutes.get("/get/:postId", postController.getPostController);

postRoutes.get("/get-all", postController.getAllPostsController);

postRoutes.post(
  "/create",
  requireAuth,
  zodValidate(createPostSchema),
  upload.single("image"),
  postController.createPostController
);

postRoutes.patch(
  "/update/:postId",
  zodValidate(updatePostSchema),
  requireAuth,
  upload.single("image"),
  postController.updatePostController
);

postRoutes.delete(
  "/delete/:postId",
  requireAuth,
  postController.deletePostController
);

export default postRoutes;
