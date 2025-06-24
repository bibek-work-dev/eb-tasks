import mongoose, { Schema } from "mongoose";

// 🔄 Variant Type (Optional, if needed)
// Variant {
//   name: string            // "Color" or "Size"
//   value: string           // "Red" or "XL"
//   stockQuantity: number   // Optional, per variant stock
//   priceDifference?: number
// }

// 🗂 Optional: Category Schema
// Category {
//   _id: ObjectId
//   name: string               // "Electronics"
//   parentCategoryId?: ObjectId // For nesting
//   defaultAttributes?: string[] // ["color", "model", "screenSize"]
// }

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    images: [{ type: String }],
    price: { type: Number },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    categoryName: { type: String },
    description: { type: String },
    stock: { type: String },
    unit: { type: String, required: true },
  },
  { timestamps: true }
);

export type ProductDocument = mongoose.InferSchemaType<typeof productSchema>;

const ProductModel = await mongoose.model<ProductDocument>(
  "Product",
  productSchema
);

export default ProductModel;
