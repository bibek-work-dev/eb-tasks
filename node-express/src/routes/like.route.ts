import express from "express";
import requireAuth from "../middlewares/requireAuth";

import * as likeController from "../controllers/like.controller";

const likeRoutes = express.Router();

likeRoutes.patch("/:postId", requireAuth, likeController.likePostController);

likeRoutes.get("/get-likes/:postId", likeController.getLikesController);

export default likeRoutes;
