import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { CreateTodoInput } from './dtos/create_todo.dto';
import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import { UpdateTodoToDoneInput } from './dtos/update_todo_to_done.dto';
import { UpdateTodoToWillNotDo } from './dtos/update_todo_to_willnotdo.dto';
import { DeleteTodoInput } from './dtos/delete_todo.dto';
import { UpdateTodoInput } from './dtos/update_todo.dto';
import { Todo } from './tasks.model';

@Resolver(() => Todo)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Query(() => Todo)
  async getTodo(@Args('id', ParseIntPipe) id: number) {
    const result = this.tasksService.findOne(id);
    return result;
  }

  @Query(() => [Todo])
  async getTodos() {
    const result = this.tasksService.findAll();
    return result;
  }

  @Mutation(() => Todo)
  async createTodo(createTodoInput: CreateTodoInput) {
    const { created_by, ...rest } = createTodoInput;
    const createdBy = parseInt(created_by);
    if (Number.isNaN(createdBy))
      throw new BadRequestException('Incorrect userId');
    const result = this.tasksService.create(createdBy, rest);
    return result;
  }

  @Mutation(() => Todo)
  async udpateTodo(updateTodoInput: UpdateTodoInput) {
    const updatedTodo = this.tasksService.update(updateTodoInput);
    return updatedTodo;
  }

  @Mutation(() => Todo)
  async updateTodoToDone(updateToDoToDoneInput: UpdateTodoToDoneInput) {
    const result = this.tasksService.updateToDone(updateToDoToDoneInput);
    return result;
  }

  @Mutation(() => Todo)
  updateTodoToWillNotDo(updateTodoToWillNotDo: UpdateTodoToWillNotDo) {
    const result = this.tasksService.updateToWillNotDo(updateTodoToWillNotDo);
    return result;
  }

  @Mutation(() => Todo)
  async deleteTodo(deleteTodoInput: DeleteTodoInput) {
    const result = this.tasksService.delete(deleteTodoInput);
    return result;
  }
}
