import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonsModule } from './commons/commons.module';
import { GraphQLError } from 'graphql';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: false,
      context: ({ req }) => ({ req }),

      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': true,
      },
      formatError: (error: GraphQLError) => {
        const { message, extensions, path } = error;
        console.log('Here is the app module level formatting');
        return {
          message,
          code: extensions?.code || 'INTERNAL_SERVER_ERROR',
          path,
          timestamp: new Date().toISOString(),
        };
      },
    }),
    UsersModule,
    TasksModule,
    CommonsModule,
    AuthModule,
  ],
})
export class AppModule {}
