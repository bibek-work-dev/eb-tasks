import { Module } from '@nestjs/common';
import { LikeDislikeService } from './like-dislike.service';
import { LikeDislikeController } from './like-dislike.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeDislike, LikeDislikeSchema } from './like-dislike.schema';
import { Post, PostSchema } from '../posts.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: LikeDislike.name, schema: LikeDislikeSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [LikeDislikeController],
  providers: [LikeDislikeService],
  exports: [LikeDislikeService],
})
export class LikeDislikeModule {}
