import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateTodoToPendingInput {
  @Field()
  @IsNotEmpty()
  userId: number;

  @Field()
  @IsNotEmpty()
  todoId: number;
}
