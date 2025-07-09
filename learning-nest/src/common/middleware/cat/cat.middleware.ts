import { Request, Response, NextFunction } from 'express';

export function CatMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log('[Cats functional Middleware  request]', req.method, req.url);
  next();
}
