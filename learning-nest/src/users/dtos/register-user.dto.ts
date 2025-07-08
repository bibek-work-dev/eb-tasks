import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

enum UserRole {
  USER,
  ADMIN,
}
export class registerUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @IsEnum(UserRole)
  role?: UserRole;
}
