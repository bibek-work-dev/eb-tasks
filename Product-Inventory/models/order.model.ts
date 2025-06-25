import mongoose, { Schema, Types } from "mongoose";

const orderSchema = new Schema(
  {
    orderNumber: { type: String, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],

    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partially_paid", "paid"],
      default: "unpaid",
    },
    paidAt: { type: Date },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    note: { type: String },
    address: {
      addressType: { type: String }, // this is like office or home or whatever
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String }, // Optional: Tole/Basti/Neighborhood
      zipCode: { type: String }, // Optional: if available in region
      landmark: { type: String }, // Optional: Near X location
    },
  },
  { timestamps: true }
);

export type OrderDocument = mongoose.InferSchemaType<typeof orderSchema>;

const OrderModel = await mongoose.model<OrderDocument>("Product", orderSchema);

export default OrderModel;

/*



const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(v: OrderItem[]) => v.length > 0, 'Order must have at least one item'],
    },

    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'],
      default: 'pending',
    },

    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partially_paid', 'paid'],
      default: 'unpaid',
    },
  },
  { timestamps: true }
);

export const Order = model<OrderDocument>('Order', OrderSchema);


*/
