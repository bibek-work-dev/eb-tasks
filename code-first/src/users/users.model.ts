import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Course } from 'src/courses/courses.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  // no @Field for password → not exposed in GraphQL
  password: string;

  @Field(() => Course)
  enrolledCourses: Course[];
}
