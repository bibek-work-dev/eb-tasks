import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateTodoToPendingInput {
  @Field()
  @IsMongoId()
  @IsNotEmpty()
  todoId: string;
}
