import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppJwtPayload } from 'src/common/types/jwtpayload';
import { AuthenticatedRequest } from 'src/common/types/request';

export const User = createParamDecorator(
  (data: keyof AppJwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);
