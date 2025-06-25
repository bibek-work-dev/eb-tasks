import mongoose, { Schema, Types } from "mongoose";

const purchasedSchema = new Schema(
  {
    purchasedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        unitCost: { type: Number, required: true },
        totalCost: { type: Number, required: true },
      },
    ],
    purchaseDate: { type: Date, default: Date.now },
    note: { type: String },
  },
  { timestamps: true }
);

export type PurchasedDocument = mongoose.InferSchemaType<
  typeof purchasedSchema
>;

const PruchasedModel = mongoose.model("Purchase", purchasedSchema);

export default PruchasedModel;
