import { OmitType } from '@nestjs/mapped-types';
import { registerUserDto } from './register-user.dto';

export class UpdateUserDto extends OmitType(registerUserDto, [
  'password',
  'email',
] as const) {}
