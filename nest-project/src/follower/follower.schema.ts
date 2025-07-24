import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FollowStatus = 'pending' | 'accepted' | 'rejected';

@Schema({ timestamps: true })
export class Follower {
  @Prop({ type: Types.ObjectId, ref: 'Auth', required: true })
  followerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Auth', required: true })
  followingId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: FollowStatus;
}

export type FollowerDocument = Follower & Document;
export const FollowerSchema = SchemaFactory.createForClass(Follower);
FollowerSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
