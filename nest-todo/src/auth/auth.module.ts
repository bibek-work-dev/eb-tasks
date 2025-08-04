import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { CommonsModule } from 'src/commons/commons.module';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Jti, JtiSchema } from './jti.schema';
import { JtiService } from './jti.service';

@Module({
  imports: [
    CommonsModule,
    UsersModule,
    PassportModule,
    MongooseModule.forFeature([{ name: Jti.name, schema: JtiSchema }]),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, JtiService],
})
export class AuthModule {
  constructor() {
    console.log('Auth Module instantiated');
  }
}
