import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// @Schema()
// export class Address {
//   @Prop({ required: true })
//   street: string;

//   @Prop({ required: true })
//   city: string;

//   @Prop({ required: true })
//   country: string;

//   @Prop()
//   zipCode?: string;
// }

// export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
