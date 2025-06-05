import * as userService from "../services/user.service";
import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "../utils/validationSchemas";

export const registerController = async (req: Request, res: Response) => {
  console.log("req, res", req, res);
  try {
    const result = registerSchema.safeParse(req.body);
    console.log("register", result);
    if (!result.success) {
      res.status(201).json({
        success: false,
        errors: result.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
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
    res.status(400).json({ success: false, error: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(201).json({
        success: false,
        errors: result.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }

    const { email, password } = req.body;
    const user = await userService.loginService({ email, password });
    res.status(200).json({
      success: true,
      message: "You have been logged in successfully",
      data: user,
    });
  } catch (error: any) {
    console.log("lgoin error", error);
    res.status(400).json({ success: false, error: error.message });
  }
};
