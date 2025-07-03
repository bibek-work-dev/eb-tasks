import mongoose, { Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    ownedBy: { type: Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    images: [{ type: String }],
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    categoryName: { type: String, required: true },
    description: { type: String, required: true },
    totalStockQuantity: { type: Number, default: 0, required: true },
    unit: { type: String, required: true }, // kg, liter ho ki k ho ?
    // variants: [
    //   {
    //     name: String,
    //     value: String,
    //     stockQuantity: Number,
    //     priceDifference: Number,
    //     totalPrice: Number,
    //   },
    // ],
    attributes: {
      types: Schema.Types.Mixed,
      default: {},
    },
    reorderLevel: { type: Number, default: 20 },
  },
  { timestamps: true }
);

export type ProductDocument = mongoose.InferSchemaType<typeof productSchema>;

const ProductModel = await mongoose.model<ProductDocument>(
  "Product",
  productSchema
);

export default ProductModel;
