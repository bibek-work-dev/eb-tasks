import { Module } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [TokenService],
  exports: [TokenService],
})
export class CommonsModule {}
