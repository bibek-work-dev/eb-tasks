import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class RemoveGroupMembersDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'userIdsToRemove must not be empty' })
  @IsString({ each: true, message: 'Each userId must be a valid MongoId' })
  userIdsToRemove: string[];
}
