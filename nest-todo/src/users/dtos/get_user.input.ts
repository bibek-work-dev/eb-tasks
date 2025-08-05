import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class GetUsersInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsOptional()
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsOptional()
  limit: number;
}
