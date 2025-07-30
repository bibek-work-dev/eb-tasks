import { Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

export class UpdateTodoToWillNotDo {
  @Field()
  @IsNotEmpty()
  userId: number;

  @Field()
  @IsNotEmpty()
  todoId: number;
}
