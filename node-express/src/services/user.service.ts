import UserModel from "../models/user.model";
import bcryptjs from "bcryptjs";
import {
  BadRequestError,
  ConflictError,
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
import {
  typeForgotPasswordInput,
  typeLoginInput,
  typeRegisterInput,
  typeResetPasswordInput,
  typeUpdateProfileInput,
  typeVerifyEmailInput,
} from "../utils/validations/usersvalidationSchemas";
import { v4 as uuidv4 } from "uuid";
import JtiModel from "../models/jti.model";

const JWT_SECRET = getEnvVariables().JWT_SECRET;
const JWT_EXPIRES_IN = getEnvVariables().JWT_EXPIRESIN || `1d`;

const getRandomNumber = (): string => {
  return Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
};

const getDateFifteenMinutesFromNow = (): Date => {
  return new Date(Date.now() + 15 * 60 * 1000);
};

export const registerService = async (data: typeRegisterInput) => {
  const alreadyExists = await UserModel.findOne({ email: data.email });
  if (alreadyExists) throw new ConflictError("Email already exists");

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

export const loginService = async (data: typeLoginInput) => {
  const alreadyExists = await UserModel.findOne({ email: data.email }).select(
    "password status _id email name"
  );
  console.log("login service");
  if (!alreadyExists) throw new NotFoundError("User doesn't exist");

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

  const jti = uuidv4();

  const token = jwt.sign(
    {
      userId: alreadyExists._id.toString(),
      email: alreadyExists.email.toString(),
      jti: jti,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as any }
  );

  await JtiModel.create({ jti });

  return { token, user: alreadyExists };
};

export const verifyEmailService = async ({
  email,
  code,
}: typeVerifyEmailInput) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new NotFoundError("No such user exists");
  }

  if (user.status === "Active") {
    throw new BadRequestError("User is already verified.");
  }

  if (user.verificationToken !== code) {
    throw new UnauthorizedError("Invalid verification code.");
  }

  const currDate = new Date();
  console.log(typeof currDate);

  if (user.verficationDate && user.verficationDate < currDate) {
    throw new BadRequestError(
      "Verification token has expired. Please request a new one."
    );
  }

  user.status = "Active";
  user.verificationToken = undefined;
  user.verficationDate = undefined;

  await user.save();
  return true;
};

export const getMeService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  return user;
};

export const updateProfileService = async (
  userId: string,
  data: typeUpdateProfileInput
) => {
  const updatedUser = await UserModel.findByIdAndUpdate(userId, data, {
    new: true,
  });
  return updatedUser;
};

export const logoutService = async (jti: string) => {
  const removedzJti = await JtiModel.findOneAndDelete({ jti });
  console.log("removedzJti", removedzJti);
  if (!removedzJti) {
    throw new NotFoundError("Something went wrong");
  }

  // client le garxa afai remove
  return removedzJti;
};

export const changePasswordService = async (
  userId: string,
  password: string
) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  if (user.status !== "Active") {
    throw new ForbiddenError("You aren't verified");
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const updatePassword = await UserModel.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  );
  return updatePassword;
};

export const forgotPasswordService = async (data: typeForgotPasswordInput) => {
  const user = await UserModel.findOne({ email: data.email });
  if (!user) throw new NotFoundError("No such user found");
  if (user.status !== "Active") {
    throw new ForbiddenError("You aren't verified");
  }
  const resetToken = getRandomNumber();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresIn = getDateFifteenMinutesFromNow();
  await user.save();
  await sendResetPasswordEmail(data.email, resetToken);
  return true;
};

export const resetPasswordService = async (data: typeResetPasswordInput) => {
  const user = await UserModel.findOne({
    resetPasswordToken: data.code,
    _id: data.userId,
  });
  if (!user) throw new Error("No such user found");
  if (user?.status !== "Active") {
    throw new ForbiddenError("You aren't verified");
  }
  console.log("user in hashedPassword", user);
  if (
    !user.resetPasswordExpiresIn ||
    user.resetPasswordExpiresIn < new Date()
  ) {
    throw new BadRequestError("Reset password token has expired");
  }
  const hashedPassword = await bcryptjs.hash(data.newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresIn = undefined;

  await user.save();
  console.log("user after hashedPassword", user);

  return true;
};
