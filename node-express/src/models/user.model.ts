import mongoose, { Schema } from "mongoose";
import { string } from "zod";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
