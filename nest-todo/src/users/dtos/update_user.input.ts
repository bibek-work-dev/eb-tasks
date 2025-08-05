import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  @IsNotEmpty()
  @Length(3, 15)
  username: string;
}
