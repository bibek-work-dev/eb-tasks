import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field(() => String)
  @IsNotEmpty()
  @Length(3, 15)
  username: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @Length(3, 15)
  password: string;
}
