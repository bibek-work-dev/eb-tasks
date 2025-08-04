import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JtiDocument = Jti & Document;

@Schema({ timestamps: true })
export class Jti {
  @Prop({ required: true, unique: true })
  jti: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: false })
  revoked: boolean;
}

export const JtiSchema = SchemaFactory.createForClass(Jti);
