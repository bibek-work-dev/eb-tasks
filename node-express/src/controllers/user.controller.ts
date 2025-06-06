import * as userService from "../services/user.service";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const registerController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, status, dateOfBirth, hobbies, bio } =
      req.body;
    const user = await userService.registerService({
      name,
      email,
      password,
      status,
      dateOfBirth,
      hobbies,
      bio,
    });
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginService({ email, password });
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
    const { email, code } = req.body;
    console.log("email and code", email, code);
    const result = await userService.verifyEmailService(email, code);
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
    const userId = req.user?.userId;
    const user = await userService.getMeService(userId);
  } catch (error) {
    next(error);
  }
};

export const updateProfileController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userService.updateProfileService();
    res.status(201).json({
      success: true,
      data: result,
      message: "The email has been successfully sent",
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
    const result = await userService.changePasswordService();
  } catch (error: any) {
    next(error);
  }
};

export const forgotPasswordController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    await userService.forgotPasswordService(email);
    res
      .status(201)
      .json({ success: true, message: "The email has been successfully sent" });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newPassword, confirmPassword, code, userId } = req.body;
    const result = await userService.resetPasswordService(
      newPassword,
      confirmPassword,
      code,
      userId
    );
    res.status(201).json({
      success: true,
      data: null,
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
