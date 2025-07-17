import { IsEnum, IsString } from 'class-validator';
import { UserRole } from 'src/common/types/user-role';

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsEnum({ default: UserRole.USER })
  role?: UserRole;
}
