import { IsString } from 'class-validator';

export class CreateOneToOneChatDto {
  @IsString()
  participantId: string;
}
