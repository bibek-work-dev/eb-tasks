import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field()
  @IsNotEmpty()
  @Length(3, 15)
  title: string;

  @Field(() => String)
  @Length(5, 20)
  @IsNotEmpty()
  description: string;

  @Field(() => String)
  created_by: string;
}
