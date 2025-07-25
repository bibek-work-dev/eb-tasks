import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Subject {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
