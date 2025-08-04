import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { CommonsModule } from 'src/commons/commons.module';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [CommonsModule, UsersModule, PassportModule],
  providers: [AuthResolver, AuthService, JwtStrategy],
})
export class AuthModule {
  constructor() {
    console.log('Auth Module instantiated');
  }
}
