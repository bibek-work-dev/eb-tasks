import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/users.model';

@ObjectType()
export class Course {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  instructor: User;
}
