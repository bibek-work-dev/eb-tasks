import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field()
  @IsString()
  @Length(3, 10)
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @Length(6, 12)
  password: string;
}
