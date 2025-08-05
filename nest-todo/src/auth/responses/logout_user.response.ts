import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LogoutUserResponse {
  @Field(() => String)
  message: string;
}
