import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  generateJti(): string {
    return uuidv4();
  }

  createAccessToken(
    payload: Omit<AccessTokenPayload, 'jti'>,
    jti: string,
  ): string {
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

  createRefreshToken(
    payload: Omit<RefreshTokenPayload, 'jti'>,
    jti?: string,
  ): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_JWT_SECRET'),
      expiresIn: this.configService.get('REFRESH_JWT_EXPIRESIN'),
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      const secret = this.configService.get<string>('ACCESS_JWT_SECRET');
      return this.jwtService.verify<AccessTokenPayload>(token, { secret });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const secret = this.configService.get<string>('REFRESH_JWT_SECRET');
      return this.jwtService.verify<RefreshTokenPayload>(token, { secret });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
