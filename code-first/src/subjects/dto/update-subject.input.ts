import { IsMongoId } from 'class-validator';
import { CreateSubjectInput } from './create-subject.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateSubjectInput extends PartialType(CreateSubjectInput) {
  @Field(() => ID)
  @IsMongoId()
  _id: string;
}
