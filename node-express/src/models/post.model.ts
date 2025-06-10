import mongoose from "mongoose";

export interface IPost extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  imageUrl: string;
  userId: mongoose.Types.ObjectId;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model<IPost>("Post", postSchema);
export default PostModel;
export type PostDocument = mongoose.InferSchemaType<typeof postSchema>;
