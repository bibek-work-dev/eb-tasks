import { Schema, model, InferSchemaType, HydratedDocument } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export type postType = InferSchemaType<typeof postSchema>;
export type postDocument = HydratedDocument<postType>;
export const PostModel = model<postType>("Post", postSchema);
