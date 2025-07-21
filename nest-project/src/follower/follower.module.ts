import { Module } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { FollowerController } from './follower.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Follower, FollowerSchema } from './follower.schema';
import { Auth, AuthSchema } from 'src/auth/auth.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
      { name: Auth.name, schema: AuthSchema },
    ]),
  ],
  controllers: [FollowerController],
  providers: [FollowerService],
})
export class FollowerModule {}
