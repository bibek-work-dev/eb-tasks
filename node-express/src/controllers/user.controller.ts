import * as userService from "../services/user.service";
import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  typeForgotPasswordInput,
  typeLoginInput,
  typeRegisterInput,
  typeResetPasswordInput,
  typeUpdateProfileInput,
} from "../utils/validations/usersvalidationSchemas";

export const registerController: RequestHandler = async (
  req: Request<{}, {}, typeRegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.registerService(req.body);
    console.log("user", user);
    res.status(201).json({
      success: true,
      data: user,
      message:
        "You have been successfully registered. Please check your email for verfication",
    });
  } catch (error: any) {
    console.log("register, error", error);
    next(error);
  }
};

export const loginController: RequestHandler = async (
  req: Request<{}, {}, typeLoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.loginService(req.body);
    console.log("user", user);
    res.status(200).json({
      success: true,
      message: "You have been logged in successfully",
      data: user,
    });
  } catch (error: any) {
    console.log("lgoin error", error);
    next(error);
  }
};

export const verifyEmailController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userService.verifyEmailService(req.body);
    res.status(201).json({
      success: true,
      result,
      message:
        "You are now successfully verified. You can access the resources now",
    });
  } catch (error: any) {
    console.log("error", error);
    next(error);
  }
};

export const getMeController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const user = await userService.getMeService(userId);
    res.status(200).json({
      success: true,
      data: user,
      message: "user fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileController: RequestHandler = async (
  req: Request<{}, {}, typeUpdateProfileInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const result = await userService.updateProfileService(userId, req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: "The proifle has been updated ",
    });
  } catch (error) {
    next(error);
  }
};

export const changePasswordController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.userId;
    const result = await userService.changePasswordService(userId, newPassword);
    res.status(200).json({
      success: true,
      message: "Your password has been changed !!",
    });
  } catch (error: any) {
    next(error);
  }
};

export const forgotPasswordController: RequestHandler = async (
  req: Request<{}, {}, typeForgotPasswordInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    await userService.forgotPasswordService(req.body);
    res
      .status(201)
      .json({ success: true, message: "The email has been successfully sent" });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController: RequestHandler = async (
  req: Request<{}, {}, typeResetPasswordInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userService.resetPasswordService(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: "Your password have been successfully changed",
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userService.logoutService();
    res.status(200).json({
      success: true,
      data: null,
      message: "You have been successfully logged Out.",
    });
  } catch (error) {
    next(error);
  }
};
