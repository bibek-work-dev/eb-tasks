import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './tasks.schema';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  providers: [TasksResolver,
        {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
    TasksService],
})
export class TasksModule {}
