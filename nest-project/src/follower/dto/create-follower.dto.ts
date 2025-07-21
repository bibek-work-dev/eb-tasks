import { IsMongoId } from 'class-validator';

export class CreateFollowerDto {
  @IsMongoId()
  followingId: string;
}
