import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../users.model';

@ObjectType()
export class PaginateMeta {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  total: number;

  @Field(() => Boolean)
  hasNextPage: boolean;
}

@ObjectType()
export class GetUserResponse {
  @Field(() => [User])
  users: User[];

  @Field(() => PaginateMeta)
  paginate: PaginateMeta;
}
