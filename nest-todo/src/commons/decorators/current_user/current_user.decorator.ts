import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(context);
    console.log(
      'getting  currentUser in decorator',
      gqlCtx.getContext().req.user,
    );
    return gqlCtx.getContext().req.user; // this is set by Jwt Guard hai
  },
);
