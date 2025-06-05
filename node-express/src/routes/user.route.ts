import express from "express";
import * as userController from "../controllers/user.controller";
// import { zodValidation } from "../middlewares/zodValidation";
import { registerSchema } from "../utils/validationSchemas";

const userRoutes = express.Router();

userRoutes.post(
  "/register",
  //   zodValidation(registerSchema),
  userController.registerController
);
userRoutes.post("/login", userController.loginController);

export default userRoutes;
