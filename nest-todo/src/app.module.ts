import { Module } from '@nestjs/common';
import { Context, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonsModule } from './commons/commons.module';
import { GraphQLError } from 'graphql';
import { AuthModule } from './auth/auth.module';
import * as jwt from 'jsonwebtoken';

interface ConnectionParams {
  Authorization?: string;
}

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
      context: ({ req, connection }) => {
        // for queries and mutations
        if (req) {
          return { currentUser: req.user };
        }
        return connection?.context; // it is for subscrtiption
      },

      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': {
          onConnect: (context) => {
            const { connectionParams } = context;
            console.log('connection Params in context', connectionParams);
            if (
              !connectionParams ||
              typeof connectionParams.Authorization !== 'string'
            ) {
              throw new Error('Missing or invalid Authorization header');
            }
            const token = connectionParams.Authorization?.split(' ')[1];
            const secret = process.env.ACCESS_JWT_SECRET || 'my-access-secret';

            console.log('in app module', token, secret);

            const payload = jwt.verify(token, secret);

            console.log('in payload', payload);
            return { currentUser: payload };
          },
        },
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
