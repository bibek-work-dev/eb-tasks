// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Types } from 'mongoose';
// import { ConfigService } from '@nestjs/config';

// export interface AccessTokenPayload {
//   userId: string;
//   email: string;
// }

// export interface RefreshTokenPayload {
//   email: string;
//   userId: string;
// }

// @Injectable()
// export class TokenService {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService,
//   ) {}

//   createAccessToken(payload: AccessTokenPayload): string {
//     return this.jwtService.sign(payload, {
//       secret: this.configService.get('ACCESS_JWT_SECRET'),
//       expiresIn: this.configService.get('ACCESS_JWT_EXPIRESIN'),
//     });
//   }

//   createRefreshToken(payload: RefreshTokenPayload): string {
//     return this.jwtService.sign(payload, {
//       secret: this.configService.get('REFRESH_JWT_SECRET'),
//       expiresIn: this.configService.get('REFRESH_JWT_EXPIRESIN'),
//     });
//   }

//   verifyAccessToken(token: string): AccessTokenPayload {
//     return this.jwtService.verify<AccessTokenPayload>(token, {
//       secret: this.configService.get('ACCESS_JWT_SECRET'),
//     });
//   }

//   verifyRefreshToken(token: string): RefreshTokenPayload {
//     return this.jwtService.verify<RefreshTokenPayload>(token, {
//       secret: this.configService.get('REFRESH_JWT_SECRET'),
//     });
//   }
// }
