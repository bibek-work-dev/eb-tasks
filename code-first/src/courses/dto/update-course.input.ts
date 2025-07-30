import { IsMongoId } from 'class-validator';
import { CreateCourseInput } from './create-course.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
  @Field(() => ID)
  @IsMongoId()
  _id: string;
}
