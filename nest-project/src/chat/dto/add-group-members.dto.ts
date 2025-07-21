import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AddGroupMembersDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'userIdsToAdd must not be empty' })
  @IsString({ each: true, message: 'Each userId must be a valid MongoId' })
  userIdsToAdd: string[];
}
