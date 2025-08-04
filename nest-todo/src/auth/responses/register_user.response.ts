import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { User } from 'src/users/users.model';

@ObjectType()
export class RegisterUserResponse {
  //   @Field(() => String)
  //   access_token: string;

  //   @Field(() => String)
  //   refresh_token: string;
  @Field(() => User)
  user: User;
}
