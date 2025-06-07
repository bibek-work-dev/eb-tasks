import UserModel from "../models/user.model";
import { Usertatus } from "../types/types";
import bcryptjs from "bcryptjs";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/ErrorHandler";
import {
  sendResetPasswordEmail,
  sendVerficationEmail,
} from "../utils/emails/sendEmail";
import jwt from "jsonwebtoken";
import { getEnvVariables } from "../config/genEnvVariables";

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


const JWT_SECRET = getEnvVariables().JWT_SECRET;

const getRandomNumber = (): string => {
  return Math.floor(Math.random() * 1_000_000).toString();
};

const getDateFifteenMinutesFromNow = (): Date => {
  return new Date(Date.now() + 15 * 60 * 1000);
};

export const registerService = async (data: registerInput) => {
  const alreadyExists = await UserModel.findOne({ email: data.email });
  if (alreadyExists) throw new BadRequestError("Email already exists");

  console.log("register service");
  const hashedPassword = await bcryptjs.hash(data.password, 10);
  const { password, ...rest } = data;
  const verificationToken = getRandomNumber();
  await sendVerficationEmail(data.email as string, verificationToken);
  return UserModel.create({
    ...rest,
    password: hashedPassword,
    verificationToken,
    verficationDate: getDateFifteenMinutesFromNow(),
  });
};

export const loginService = async (data: loginInput) => {
  const alreadyExists = await UserModel.findOne({ email: data.email });
  console.log("login service");
  if (!alreadyExists) throw new UnauthorizedError("User doesn't exist");

  if (alreadyExists.status != "Active") {
    throw new ForbiddenError("You aren't verified");
  }

  const isPasswordValid = await bcryptjs.compare(
    data.password,
    alreadyExists.password
  );

  if (!isPasswordValid) {
    throw new BadRequestError("Invalid credentials");
  }
  const token = jwt.sign(
    {
      userId: alreadyExists._id.toString(),
      email: alreadyExists.email.toString(),
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user: alreadyExists };
};

export const verifyEmailService = async (email: string, code: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new NotFoundError("No such user exists");
  }

  if (user.verificationToken !== code) {
    throw new UnauthorizedError("Invalid verification code.");
  }

  console.log(typeof user.verficationDate);

  const currDate = new Date();
  console.log(typeof currDate);

  if (user.verficationDate && user.verficationDate < currDate) {
    throw new BadRequestError(
      "Verification token has expired. Please request a new one."
    );
  }

  if (user.status === "Active") {
    throw new BadRequestError("User is already verified.");
  }

  user.status = "Active";
  user.verificationToken = undefined;
  user.verficationDate = undefined;

  await user.save();
};

export const getMeService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  return user;
};

export const updateProfileService = async (userId: string, data: any) => {
  const updatedUser = await UserModel.findByIdAndUpdate(userId, data, {new: true})
  return updatedUser;
};

export const logoutService = async () => {
  // client le garxa afai remove
  return true;
};

export const changePasswordService = async (userId: string, password: string
) => {
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const updatePassword  = await UserModel.findByIdAndUpdate(userId, {password: hashedPassword}, {new: true})
  return updatePassword;
};

export const forgotPasswordService = async (email: string) => {
  const user = await UserModel.findOne({ email: email });
  if (!user) throw new NotFoundError("No such user found");
  const resetToken = getRandomNumber();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresIn = getDateFifteenMinutesFromNow();
  await user.save();
  await sendResetPasswordEmail(email, resetToken);
  return true;
};

export const resetPasswordService = async (
  newPassword: string,
  confirmPassword: string,
  code: string,
  userId: string
) => {
  const user = await UserModel.findOne({
    resetPasswordToken: code,
    _id: userId,
  });
  if (!user) throw new Error("No such user found");
  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  await UserModel.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  );
  return true;
};
