import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdateTodoInput {
  @Field(() => ID)
  @IsNotEmpty()
  todoId: number;

  @Field()
  @IsNotEmpty()
  userId: number;

  @Field()
  @IsOptional()
  title: string;

  @Field(() => String)
  @IsOptional()
  description: string;
}
