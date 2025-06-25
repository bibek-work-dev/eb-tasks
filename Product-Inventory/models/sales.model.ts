import mongoose, { Schema } from "mongoose";

const salesSchema = new Schema({}, { timestamps: true });

export type SalesDocument = mongoose.InferSchemaType<typeof salesSchema>;

const SalesModel = mongoose.model("Sales", salesSchema);

export default SalesModel;
