import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/users.model';

@ObjectType()
export class LogoutUserResponse {
  @Field(() => String)
  message: string;
}
