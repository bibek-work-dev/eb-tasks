import { Schema, model, Types, Document } from "mongoose";

export interface CategoryDocument extends Document {
  name: string;
  parentCategoryId?: Types.ObjectId;
  defaultAttributes?: string[];
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },

    // Optional nesting (e.g., Mobiles under Electronics)
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    defaultAttributes: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Category = model<CategoryDocument>("Category", CategorySchema);
