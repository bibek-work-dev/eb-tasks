import { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'USER' | 'ADMIN';
}

export const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      // unique: true
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  { timestamps: true },
);
