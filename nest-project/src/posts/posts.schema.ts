import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// import { Prop, Schema } from '@nestjs/mongoose';
// import { Types } from 'mongoose';

@Schema({ _id: false })
export class LatestComment {
  @Prop({ type: Types.ObjectId, ref: 'Comment', required: true })
  commentId: Types.ObjectId;

  @Prop({ type: String, required: true })
  commenterName: string;

  @Prop({ type: String, required: true })
  comment: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

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

  // @Prop({
  //   type: [
  //     {
  //       _id: false,
  //       commentId: { type: Types.ObjectId, ref: 'Comment', required: true },
  //       commenterName: String,
  //       comment: String,
  //       createdAt: { type: Date, default: Date.now },
  //     },
  //   ],
  //   default: [],
  // })
  // latestComments: {
  //   commentId: Types.ObjectId;
  //   commenterName: string;
  //   comment: string;
  //   createdAt: Date;
  // }[];

  @Prop({ type: [LatestComment], default: [] })
  latestComments: LatestComment[];
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
