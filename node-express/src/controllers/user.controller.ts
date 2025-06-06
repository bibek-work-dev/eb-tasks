import * as userService from "../services/user.service";
import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "../utils/validationSchemas";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("req, res", req, res);
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
      message: "You have been successfully regiustered",
    });
  } catch (error: any) {
    console.log("register, error", error);
    next(error);
  }
};

export const loginController = async (
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
