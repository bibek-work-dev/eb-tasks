import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/users.model';

@ObjectType()
export class LoginUserResponse {
  @Field(() => String)
  access_token: string;

  @Field(() => String)
  refresh_token: string;

  @Field(() => User)
  user: User;
}
