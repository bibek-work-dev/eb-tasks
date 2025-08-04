export interface AccessTokenPayload {
  userId: string;
  email: string;
  jti: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  email: string;
  userId: string;
  jti: string;
  iat?: number;
  exp?: number;
}
