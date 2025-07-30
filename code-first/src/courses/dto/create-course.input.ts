import { InputType, Int, Field, Float, ID } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateCourseInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Float)
  @IsNumber()
  price: number;
}
