import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { CreateTodoInput } from './dtos/create_todo.input';
import { UpdateTodoToDoneInput } from './dtos/update_todo_to_done.input';
import { DeleteTodoInput } from './dtos/delete_todo.input';
import { UpdateTodoInput } from './dtos/update_todo.input';
import { Todo } from './tasks.model';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { UpdateTodoToPendingInput } from './dtos/update_todo_to_pending.input';
import { UpdateTodoToWillNotDoInput } from './dtos/update_todo_to_willnotdo.input';
import { UserDocument } from 'src/users/users.schema';
import { PubSub } from 'graphql-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/commons/decorators/current_user/current_user.decorator';
import { AccessTokenPayload } from 'src/commons/types/token-payload.types';
import { JwtAuthGuard } from 'src/commons/guards/jwt/jwt.guard';
import { GetTodoInput } from './dtos/get_todo.input';

@UseGuards(JwtAuthGuard)
@Resolver(() => Todo)
export class TasksResolver {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Query(() => Todo)
  async getTodo(@Args('id') id: string) {
    const result = await this.tasksService.findOne(id);
    return result;
  }

  @Query(() => [Todo])
  async getTodos(
    @CurrentUser() user: AccessTokenPayload,
    @Args('input')
    input: GetTodoInput,
  ) {
    const result = await this.tasksService.findAll(user, input);
    return result;
  }

  @Mutation(() => Todo)
  async createTodo(
    @CurrentUser() user: AccessTokenPayload,
    @Args('input') createTodoInput: CreateTodoInput,
  ) {
    const result = await this.tasksService.create(user, createTodoInput);

    await this.pubSub.publish('taskCreated', {
      taskCreated: result,
      message: 'The task has been created',
    });
    return result;
  }

  @Mutation(() => Todo)
  async udpateTodo(
    @CurrentUser() user: AccessTokenPayload,
    @Args('input') updateTodoInput: UpdateTodoInput,
  ) {
    const updatedTodo = await this.tasksService.update(user, updateTodoInput);
    return updatedTodo;
  }

  @Mutation(() => Todo)
  async updateTodoToDone(
    @CurrentUser() user: AccessTokenPayload,

    @Args('input') updateToDoToDoneInput: UpdateTodoToDoneInput,
  ) {
    const result = this.tasksService.updateToDone(user, updateToDoToDoneInput);
    return result;
  }

  @Mutation(() => Todo)
  updateTodoToWillNotDo(
    @CurrentUser() user: AccessTokenPayload,

    @Args('input') updateTodoToWillNotDoInput: UpdateTodoToWillNotDoInput,
  ) {
    const result = this.tasksService.updateToWillNotDo(
      user,
      updateTodoToWillNotDoInput,
    );
    return result;
  }

  @Mutation(() => Todo)
  updateToDoToPending(
    @CurrentUser() user: AccessTokenPayload,

    @Args('input') updateTodoToPendingInput: UpdateTodoToPendingInput,
  ) {
    const result = this.tasksService.updateToWillPending(
      user,
      updateTodoToPendingInput,
    );
    return result;
  }

  @Mutation(() => Todo)
  async deleteTodo(
    @CurrentUser() user: AccessTokenPayload,
    @Args('input') deleteTodoInput: DeleteTodoInput,
  ) {
    const result = await this.tasksService.delete(user, deleteTodoInput);
    await this.pubSub.publish('taskDeleted', {
      message: 'The task has been deleted',
      taskDeleted: result,
    });
    return result;
  }

  @ResolveField(() => User, { name: 'user' })
  async resolveCreatedField(@Parent() todo: Todo): Promise<UserDocument> {
    console.log('todo', todo);
    return await this.usersService.findOne(todo.userId);
  }

  @Subscription(() => Todo, {
    name: 'taskCreated',
    filter: (payload, variables, context) => true,
  })
  taskCreated(@Context() context) {
    console.log('context', context);
    return this.pubSub.asyncIterableIterator('taskCreated');
  }

  @Subscription(() => Todo, {
    name: 'taskDeleted',
  })
  taskDeleted() {
    return this.pubSub.asyncIterableIterator('taskDeleted');
  }
}
