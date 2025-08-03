import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { CreateTodoInput } from './dtos/create_todo.dto';
import { UpdateTodoToDoneInput } from './dtos/update_todo_to_done.dto';
import { DeleteTodoInput } from './dtos/delete_todo.dto';
import { UpdateTodoInput } from './dtos/update_todo.dto';
import { Todo } from './tasks.model';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { UpdateTodoToPendingInput } from './dtos/update_todo_to_pending.dto';
import { UpdateTodoToWillNotDoInput } from './dtos/update_todo_to_willnotdo.dto';
import { UserDocument } from 'src/users/users.schema';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';

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
  async getTodos() {
    const result = await this.tasksService.findAll();
    return result;
  }

  @Mutation(() => Todo)
  async createTodo(@Args('input') createTodoInput: CreateTodoInput) {
    const result = await this.tasksService.create(createTodoInput);
    await this.pubSub.publish("taskCreated", {taskCreated: result})
    return result;
  }

  @Subscription(() => Todo, {
    name: "taskCreated"
  })

  @Mutation(() => Todo)
  async udpateTodo(@Args('input') updateTodoInput: UpdateTodoInput) {
    const updatedTodo = await this.tasksService.update(updateTodoInput);
    return updatedTodo;
  }

  @Mutation(() => Todo)
  async updateTodoToDone(
    @Args('input') updateToDoToDoneInput: UpdateTodoToDoneInput,
  ) {
    const result = this.tasksService.updateToDone(updateToDoToDoneInput);
    return result;
  }

  @Mutation(() => Todo)
  updateTodoToWillNotDo(
    @Args('input') updateTodoToWillNotDoInput: UpdateTodoToWillNotDoInput,
  ) {
    const result = this.tasksService.updateToWillNotDo(
      updateTodoToWillNotDoInput,
    );
    return result;
  }

  @Mutation(() => Todo)
  updateToDoToPending(
    @Args('input') updateTodoToPendingInput: UpdateTodoToPendingInput,
  ) {
    const result = this.tasksService.updateToWillPending(
      updateTodoToPendingInput,
    );
    return result;
  }

  @Mutation(() => Todo)
  async deleteTodo(@Args('input') deleteTodoInput: DeleteTodoInput) {
    const result = await this.tasksService.delete(deleteTodoInput);
      await this.pubSub.publish('taskDeleted', {
    taskDeleted: result,
  });
    return result;
  }

  @Subscription(() => Todo, {
  name: 'taskDeleted',
})
taskDeleted() {
  return this.pubSub.asyncIterableIterator('taskDeleted');
}

  @ResolveField(() => User, { name: 'user' })
  async resolveCreatedField(@Parent() todo: Todo): Promise<UserDocument> {
    console.log('todo', todo);
    return await this.usersService.findOne(todo.userId);
  }
}
