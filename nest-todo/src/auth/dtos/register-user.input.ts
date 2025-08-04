import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field(() => String)
  @IsNotEmpty()
  @Length(3, 15)
  @IsString()
  username: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @Length(3, 15)
  password: string;
}
