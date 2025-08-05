import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(context);
    return gqlCtx.getContext().req.user; // this is set by Jwt Guard hai
  },
);
