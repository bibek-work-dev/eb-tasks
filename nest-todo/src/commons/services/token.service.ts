import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../types/token-payload.types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createAccessToken(payload: AccessTokenPayload): string {
    const jti = uuidv4();
    const secret = this.configService.get<string>('ACCESS_JWT_SECRET');
    const expiresIn = this.configService.get<string>('ACCESS_JWT_EXPIRESIN');
    return this.jwtService.sign(
      { ...payload, jti },
      {
        secret: secret,
        expiresIn: expiresIn,
      },
    );
  }

  createRefreshToken(payload: RefreshTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_JWT_SECRET'),
      expiresIn: this.configService.get('REFRESH_JWT_EXPIRESIN'),
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return this.jwtService.verify<AccessTokenPayload>(token, {
      secret: this.configService.get('ACCESS_JWT_SECRET'),
    });
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return this.jwtService.verify<RefreshTokenPayload>(token, {
      secret: this.configService.get('REFRESH_JWT_SECRET'),
    });
  }
}
