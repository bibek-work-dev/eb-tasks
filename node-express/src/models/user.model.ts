import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["Active", "InActive"], default: "Active" },
    dateOfBirth: { type: Date, required: true },
    hobbies: { type: [String], default: [] },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
