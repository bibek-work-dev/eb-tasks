import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Status } from './tasks.service';

@Schema({ timestamps: true })
export class Todo extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    enum: Object.values(Status),
    default: Status.PENDING,
  })
  status: Status;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
export type TodoDocument = Todo & Document;
