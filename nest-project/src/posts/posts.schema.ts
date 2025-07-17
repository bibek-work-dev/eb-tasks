import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ type: String, required: true })
  authorName: string;

  @Prop({ type: Number, default: 0 })
  noOfLikes: number;

  @Prop({ type: Number, default: 0 })
  noOfComments: number;

  @Prop({
    type: [
      {
        _id: false,
        commentId: { type: Types.ObjectId, ref: 'Comment', required: true },
        commenterName: String,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  latestComments: {
    commentId: Types.ObjectId;
    commenterName: string;
    comment: string;
    createdAt: Date;
  }[];
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
