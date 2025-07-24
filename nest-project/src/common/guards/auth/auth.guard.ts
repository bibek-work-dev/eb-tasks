import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from 'src/common/types/request';
import { AppJwtPayload } from 'src/common/types/jwtpayload';
import { TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthorizedException('Missing or malformed token');
    }

    const token = authHeader.split(' ')[1];
    if (!token || token == 'null' || token == 'undefined') {
      console.log('real');
      throw new NotFoundException('No token found');
    }

    try {
      const decoded = this.jwtService.verify<AppJwtPayload>(token, {
        secret: process.env.ACCESS_TOKEN_JWT_SECRET,
      });
      // console.log('decoded', decoded);
      request.user = decoded;
      return true;
    } catch (error) {
      console.log('error in auth guard', error);
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Jwt Expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
