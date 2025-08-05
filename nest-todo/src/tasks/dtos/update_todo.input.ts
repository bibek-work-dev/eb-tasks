import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdateTodoInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  todoId: string;

  @Field()
  @IsOptional()
  title: string;

  @Field(() => String)
  @IsOptional()
  description: string;
}
