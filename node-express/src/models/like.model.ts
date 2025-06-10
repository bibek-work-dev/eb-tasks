import mongoose, { Schema, Document, Types } from "mongoose";

// export interface ILike extends Document {
//   userId: mongoose.Types.ObjectId;
//   postId: mongoose.Types.ObjectId;
//   createdAt: Date;
// }
export interface ILike extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// const likeSchema = new Schema<ILike>(
const likeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

// const LikeModel = mongoose.model<ILike>("Like", likeSchema);
const LikeModel = mongoose.model<ILike>("Like", likeSchema);
// export type LikeDocument = mongoose.InferSchemaType<typeof likeSchema>;
// export interface ILike extends LikeDocument {
//   userId: mongoose.Types.ObjectId;
//   postId: mongoose.Types.ObjectId;
//   createdAt: Date;
// }

export default LikeModel;
