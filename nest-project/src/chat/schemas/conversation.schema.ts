import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: [String], required: true })
  participants: string[];

  @Prop({ required: false })
  title?: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Auth' })
  adminId: Types.ObjectId;

  @Prop()
  lastMessage?: string;

  @Prop({ default: false })
  isGroup: boolean;
}

export type ConversationDocument = Conversation & Document;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
