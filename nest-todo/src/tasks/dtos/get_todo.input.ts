import { Field, InputType } from '@nestjs/graphql';
import { Status } from '../tasks.model';
import { IsOptional } from 'class-validator';

@InputType()
export class GetTodoInput {
  @Field(() => Status, { nullable: true })
  @IsOptional()
  status?: Status;
}
