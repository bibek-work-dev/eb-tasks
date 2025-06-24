import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({}, { timestamps: true });

export type OrderDocument = mongoose.InferSchemaType<typeof orderSchema>;

const OrderModel = await mongoose.model<OrderDocument>("Product", orderSchema);

export default OrderModel;
