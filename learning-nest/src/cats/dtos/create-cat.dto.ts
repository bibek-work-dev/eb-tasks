import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateCatDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
