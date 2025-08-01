import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/users/users.model';

export enum Status {
  PENDING = 'pending',
  DONE = 'done',
  WILLNOTDO = 'will-not-do',
}

registerEnumType(Status, {
  name: 'Status',
});

@ObjectType()
export class Todo {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => String)
  userId: string;

  @Field(() => User)
  user: User;

  @Field(() => Status)
  status: Status;
}
