import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from 'src/commons/types/token-payload.types';
import { User, UserDocument } from 'src/users/users.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    const secret = configService.get<string>('ACCESS_JWT_SECRET');
    console.log('get secret', secret);
    if (!secret) {
      throw new Error('ACCESS_JWT_SECRET is not set in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    console.log('here it is initailzed');
  }
  async validate(payload: AccessTokenPayload) {
    console.log('payload in jwt strategy', payload);
    const user = await this.userModel.findById(payload.userId).exec();
    console.log('user in validate in jwt strategy', user);
    if (!user) {
      console.log('aayo yeha hai');
      return null;
    }
    return user;
  }
}
