import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // console.log('here is the jwt auth guard');
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : null;

    // console.log('token in jwt auth guard', token);
    if (!token) {
      console.log('No token provided');
      return false;
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my-secret');
      // console.log('decoded token in jwt auth guard', decoded);
      request.user = decoded;
      return true;
    } catch (error) {
      console.log('Error in JWT auth guard', error);
      throw new UnauthorizedException('Invalid or Expired token');
    }
  }
}
