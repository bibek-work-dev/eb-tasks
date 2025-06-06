import express from "express";
import * as userController from "../controllers/user.controller";
// import { zodValidation } from "../middlewares/zodValidation";
import { loginSchema, registerSchema } from "../utils/validationSchemas";
import { zodValidate } from "../middlewares/zodValidation";

const userRoutes = express.Router();

userRoutes.post(
  "/register",
  zodValidate(registerSchema),
  userController.registerController
);
userRoutes.post(
  "/login",
  zodValidate(loginSchema),
  userController.loginController
);

export default userRoutes;
