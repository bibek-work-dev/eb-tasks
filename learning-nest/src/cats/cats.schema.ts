import { Schema, Document } from 'mongoose';

export interface CatsDocument extends Document {
  title: String;
  description: String;
  addedBy: Schema.Types.ObjectId; // Reference to User document
  createdAt: String;
  updatedAt: String;
}

export const catsSchema = new Schema<CatsDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);
