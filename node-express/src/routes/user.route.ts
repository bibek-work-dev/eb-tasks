import express from "express";
import * as userController from "../controllers/user.controller";
// import { zodValidation } from "../middlewares/zodValidation";
import {
  changePassswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyEmailSchema,
} from "../utils/validations/usersvalidationSchemas";
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

userRoutes.patch(
  "/update-profile",
  zodValidate(updateProfileSchema),
  requireAuth,
  userController.updateProfileController
);

userRoutes.post(
  "/forgot-password",
  zodValidate(forgotPasswordSchema),
  userController.forgotPasswordController
);

userRoutes.patch(
  "/reset-password",
  zodValidate(resetPasswordSchema),
  userController.resetPasswordController
);

userRoutes.patch(
  "/change-password",
  requireAuth,
  zodValidate(changePassswordSchema),
  userController.changePasswordController
);

userRoutes.get("/logout", userController.logoutController);

export default userRoutes;
