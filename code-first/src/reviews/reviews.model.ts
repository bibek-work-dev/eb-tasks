import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Review {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  user: string;

  @Field(() => ID)
  course: string;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  comment?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
