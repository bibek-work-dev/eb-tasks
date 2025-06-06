import UserModel from "../models/user.model";
import { Usertatus } from "../types/types";
import bcryptjs from "bcryptjs";
import { BadRequestError, UnauthorizedError } from "../utils/ErrorHandler";

interface registerInput {
  name: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  status: Usertatus;
  hobbies: string[];
  bio: string;
}

interface loginInput {
  email: string;
  password: string;
}

export const registerService = async (data: registerInput) => {
  const alreadyExists = await UserModel.findOne({ email: data.email });
  if (alreadyExists) throw new BadRequestError("Email already exists");

  const hashedPassword = await bcryptjs.hash(data.password, 10);
  const { password, ...rest } = data;
  return UserModel.create({ ...rest, password: hashedPassword });
};

export const loginService = async (data: loginInput) => {
  const alreadyExists = await UserModel.findOne({ email: data.email });
  if (!alreadyExists) throw new UnauthorizedError("User doesn't exist");

  const isPasswordValid = await bcryptjs.compare(
    data.password,
    alreadyExists.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  return alreadyExists;
};
