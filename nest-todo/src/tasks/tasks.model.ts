import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Todo {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  created_by: number;
}
