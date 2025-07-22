import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Auth' })
  fromUserId: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Auth' })
  toUserId?: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Conversation' })
  conversationId: string;

  @Prop({ required: true })
  content: string;
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);
