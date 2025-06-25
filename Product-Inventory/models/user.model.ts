import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    lastLogin: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export type UserDocument = mongoose.InferSchemaType<typeof userSchema>;

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
