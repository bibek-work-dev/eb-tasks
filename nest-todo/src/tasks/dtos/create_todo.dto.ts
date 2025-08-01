import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, Length } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field(() => String)
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsNotEmpty()
  @Length(3, 15)
  title: string;

  @Field(() => String)
  @Length(5, 20)
  @IsNotEmpty()
  description: string;
}
