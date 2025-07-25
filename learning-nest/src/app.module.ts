import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { CatsModule } from './cats/cats.module';
import { UserModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GlobalMiddleware } from './common/middleware/global/global.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGO_URI');
        if (!uri) {
          throw new Error(
            'MONGO_URI is not defined in the environment variables',
          );
        }
        return {
          uri,
        };
      },
    }),
    CatsModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GlobalMiddleware).forRoutes('*');
  }
}
