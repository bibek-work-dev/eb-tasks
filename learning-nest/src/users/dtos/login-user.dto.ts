import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class loginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
