import { Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

export class DeleteTodoInput {
  @Field()
  @IsNotEmpty()
  userId: number;

  @Field()
  @IsNotEmpty()
  todoId: number;
}
