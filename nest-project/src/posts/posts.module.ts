import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './posts.schema';
import { JwtModule } from '@nestjs/jwt';
import { Comment, CommentSchema } from 'src/comments/comments.schema';
import { LikeDislikeModule } from './like-dislike/like-dislike.module';
import {
  LikeDislike,
  LikeDislikeSchema,
} from './like-dislike/like-dislike.schema';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
      { name: LikeDislike.name, schema: LikeDislikeSchema },
    ]),
    LikeDislikeModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
