import mongoose, { Schema, Types } from "mongoose";

export interface IFollower extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  followerId: mongoose.Types.ObjectId;
  followingId: mongoose.Types.ObjectId;
  status: "REQUESTED" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

const followerSchema = new Schema<IFollower>(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["REQUESTED", "ACCEPTED", "REJECTED"],
      default: "REQUESTED",
    },
  },
  {
    timestamps: true,
  }
);

const FollowerModel = mongoose.model<IFollower>("Follower", followerSchema);

export default FollowerModel;
