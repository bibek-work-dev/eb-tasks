import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('[User class based Middleware] request', req.method, req.url);
    next();
  }
}
