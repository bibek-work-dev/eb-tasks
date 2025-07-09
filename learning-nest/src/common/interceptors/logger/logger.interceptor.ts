import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    console.log(`${method} ${url} - incoming request in interceptors`);

    return next.handle().pipe(
      map((responseFromController) => {
        const { data, message } = responseFromController;
        const duration = Date.now() - now;
        console.log(`${method} ${url} - response time: ${duration}ms`);
        return {
          success: true,
          message: message,
          data: data,
        };
      }),
    );
  }
}
