import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { LoggerService } from 'src/logs/logs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { catsSchema } from './cats.schema';
import { UserMiddleware } from 'src/common/middleware/user/user.middleware';
import { CatMiddleware } from 'src/common/middleware/cat/cat.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cat', schema: catsSchema }])],
  controllers: [CatsController],
  providers: [CatsService, LoggerService],
})
export class CatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CatMiddleware).forRoutes({
      path: 'cats',
      method: RequestMethod.ALL,
    });
  }
}
