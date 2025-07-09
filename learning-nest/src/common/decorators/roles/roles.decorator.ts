export enum EnumRole {
  ADMIN = 'Admin',
  USER = 'User',
}

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...args: EnumRole[]) => SetMetadata(ROLES_KEY, args);
