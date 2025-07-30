import { IsMongoId } from 'class-validator';
import { CreateReviewInput } from './create-review.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {
  @Field(() => ID)
  @IsMongoId()
  _id: string;
}
