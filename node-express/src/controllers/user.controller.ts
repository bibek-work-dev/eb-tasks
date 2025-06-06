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
      message:
        "You are now successfully verified. You can access the resources now",
    });
  } catch (error: any) {
    console.log("error", error);
    next(error);
  }
};
