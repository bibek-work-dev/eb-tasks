import express from "express";
import * as userController from "../controllers/user.controller";
// import { zodValidation } from "../middlewares/zodValidation";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../utils/validationSchemas";
import { zodValidate } from "../middlewares/zodValidation";
import requireAuth from "../middlewares/requireAuth";

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

userRoutes.post(
  "/verify-email",
  zodValidate(verifyEmailSchema),
  userController.verifyEmailController
);

userRoutes.get("/get-me", requireAuth, userController.getMeController);

userRoutes.put("/update-profile", userController.updateProfileController);

userRoutes.post(
  "/forgot-password",
  zodValidate(forgotPasswordSchema),
  userController.forgotPasswordController
);

userRoutes.post(
  "/reset-password",
  zodValidate(resetPasswordSchema),
  userController.resetPasswordController
);

userRoutes.patch(
  "/change-password",
  requireAuth,
  userController.changePasswordController
);

userRoutes.get("/logout", userController.logoutController);

export default userRoutes;
