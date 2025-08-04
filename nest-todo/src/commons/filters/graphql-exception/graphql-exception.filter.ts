// import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
// import { GqlArgumentsHost } from '@nestjs/graphql';
// import { GraphQLError } from 'graphql';

// @Catch()
// export class GraphqlExceptionFilter<T> implements ExceptionFilter {
//   catch(exception: T, host: ArgumentsHost) {
//     const gqlHost = GqlArgumentsHost.create(host);
//     const info = gqlHost.getInfo();
//     const path = info?.fieldName || null;

//     const response = exception.getResponse() as any;

//     const message = response?.message || 'An unexpected error occurred';
//     const code = response?.errorCode || 'GRAPHQL_EXCEPTION';
//     const status = exception.getStatus?.() || 400;

//     return new GraphQLError(message, {
//       extensions: {
//         code,
//         status,
//         path,
//         timestamp: new Date().toISOString(),
//       },
//     });
//   }
// }

import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphqlExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const path = info?.fieldName || null;

    console.log('Here is the erorr from exception filter');

    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      let message = '';
      let code = exception.name;
      let status = exception.getStatus();

      console.log('variable in exception', message, code, status);

      if (typeof response === 'string') {
        message = response;
      } else if (Array.isArray((response as any).message)) {
        message = (response as any).message.join(', ');
      } else if (typeof response === 'object' && response !== null) {
        message = (response as any).message || exception.message;
        code = (response as any).errorCode || code;
      } else {
        message = exception.message;
      }

      return new GraphQLError(message, {
        extensions: {
          code,
          status,
          path,
          timestamp,
        },
      });
    }

    return new GraphQLError('Internal server error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        status: 500,
        path,
        timestamp,
      },
    });
  }
}
