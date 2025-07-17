import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class LikeDislike {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  postId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ default: true }) // true = like, false = dislike
  isLike: boolean;
}

export type LikeDislikeDocument = LikeDislike & Document;
export const LikeDislikeSchema = SchemaFactory.createForClass(LikeDislike);
