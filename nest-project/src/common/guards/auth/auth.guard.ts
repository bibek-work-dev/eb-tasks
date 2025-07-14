import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from 'src/common/types/request';
import { AppJwtPayload } from 'src/common/types/jwtpayload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers['authorization'];

    console.log('authHeader', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthorizedException('Missing or malformed token');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify<AppJwtPayload>(token, {});
      request.user = decoded;
      return true;
    } catch (error) {
      console.log('error in auth guard', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
