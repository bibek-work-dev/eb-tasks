import e from "express";
import mongoose, { Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  status: "Active" | "InActive";
  dateOfBirth: Date;
  hobbies: string[];
  bio: string;
  verificationToken?: string;
  verficationDate?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiresIn?: Date;
  createdAt: Date;
  updatedAt: Date;
  _id: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    status: { type: String, enum: ["Active", "InActive"], default: "InActive" },
    dateOfBirth: { type: Date, required: true },
    hobbies: { type: [String], default: [] },
    bio: { type: String, default: "" },
    verificationToken: { type: String },
    verficationDate: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpiresIn: { type: Date },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
