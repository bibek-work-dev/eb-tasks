import { IsString } from 'class-validator';

export class OneToOneMessageDto {
  @IsString()
  conversationId: string;

  @IsString()
  content: string;
}
