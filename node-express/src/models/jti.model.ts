import mongoose, { Types } from "mongoose";

export interface IJti extends Document {
  _id: Types.ObjectId;
  jti: string;
  createdAt: Date;
  updatedAt: Date;
}

const jtiSchema = new mongoose.Schema(
  {
    jti: { type: String, required: true },
  },
  { timestamps: true }
);

const JtiModel = mongoose.model<IJti>("Jti", jtiSchema);
export default JtiModel;
