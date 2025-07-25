import { Field, ID, Int } from '@nestjs/graphql';
import { Course } from 'src/courses/courses.model';
import { User } from 'src/users/users.model';

export class Review {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  rating: number;

  @Field()
  comment: string;

  @Field(() => User)
  user: User;

  @Field(() => Course)
  course: Course;
}
