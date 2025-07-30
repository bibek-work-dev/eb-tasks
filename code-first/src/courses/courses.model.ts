import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from 'src/users/users.model';

@ObjectType()
export class Course {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => User)
  instructor: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
