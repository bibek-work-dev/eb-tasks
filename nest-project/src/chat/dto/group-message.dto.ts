import { IsString } from 'class-validator';

export class GroupMessageDto {
  @IsString()
  conversationId: string;

  @IsString()
  content: string;
}
