import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteTodoInput {
  @Field()
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsMongoId()
  @IsNotEmpty()
  todoId: string;
}
