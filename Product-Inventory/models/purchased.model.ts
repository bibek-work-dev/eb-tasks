import mongoose, { Schema } from "mongoose";

const purchasedSchema = new Schema({}, { timestamps: true });

export type PurchasedDocument = mongoose.InferSchemaType<
  typeof purchasedSchema
>;

const SalesModel = mongoose.model("Sales", purchasedSchema);

export default SalesModel;
