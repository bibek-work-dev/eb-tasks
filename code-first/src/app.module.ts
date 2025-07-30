import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './courses/courses.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'node:path';
import { CommonsModule } from './commons/commons.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubjectsModule } from './subjects/subjects.module';
import { createContext } from './commons/utils/gql-context.helper';
import { AccessTokenPayload, TokenService } from './commons/token.service';
import { Request } from 'express';

export interface ExtendedRequest extends Request {
  user?: AccessTokenPayload | null;
}

export interface GqlContext {
  req: ExtendedRequest;
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule, CommonsModule],
      inject: [ConfigService, TokenService],
      driver: ApolloDriver,
      useFactory: (
        configService: ConfigService,
        tokenService: TokenService,
      ) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context: ({ req }) => ({ req }),
      }),
    }),
    UsersModule,
    CoursesModule,
    ReviewsModule,
    CommonsModule,
    AuthModule,
    SubjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
