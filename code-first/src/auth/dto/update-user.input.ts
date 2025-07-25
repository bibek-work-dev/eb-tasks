import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserInput {
  @Field()
  @IsString()
  @Length(3, 10)
  username: string;

  @Field()
  @IsEmail()
  email: string;
}
