import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from 'src/common/types/user-role';

@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: Number, default: 0 })
  followerCount: number;

  @Prop({ type: Number, default: 0 })
  followingCount: number;

  @Prop({ type: String, select: false })
  refreshToken: string;

  @Prop({ type: Date, select: false })
  refreshTokenExpiresAt: Date;
}

export type AuthDocument = Auth & Document;
export const AuthSchema = SchemaFactory.createForClass(Auth);
