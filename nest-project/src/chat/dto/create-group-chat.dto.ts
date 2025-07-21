import { IsArray, ArrayMinSize, IsString } from 'class-validator';

export class CreateGroupChatDto {
  @IsArray()
  @ArrayMinSize(2, {
    message: 'At least 2 users are required for a group chat.',
  })
  @IsString({ each: true })
  participantIds: string[];

  @IsString()
  title: string;
}
