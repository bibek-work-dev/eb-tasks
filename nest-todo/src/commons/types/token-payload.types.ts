import { JwtPayload } from 'jsonwebtoken';

export interface AccessTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  jti: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  email: string;
  userId: string;
  jti: string;
}
