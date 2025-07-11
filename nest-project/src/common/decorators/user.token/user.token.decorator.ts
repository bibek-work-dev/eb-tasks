import { SetMetadata } from '@nestjs/common';

export const UserToken = (...args: string[]) => SetMetadata('user.token', args);
