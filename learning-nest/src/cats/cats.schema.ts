import { Schema, Document } from 'mongoose';

export interface CatsDocument extends Document {
  title: String;
  description: String;
  createdAt: String;
  updatedAt: String;
}

export const catsSchema = new Schema<CatsDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);
