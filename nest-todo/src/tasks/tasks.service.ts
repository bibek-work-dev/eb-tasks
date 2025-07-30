import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoInput } from './dtos/create_todo.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateTodoInput } from './dtos/update_todo.dto';
import { UpdateTodoToDoneInput } from './dtos/update_todo_to_done.dto';
import { UpdateTodoToWillNotDo } from './dtos/update_todo_to_willnotdo.dto';
import { DeleteTodoInput } from './dtos/delete_todo.dto';

export enum Status {
  PENDING = 'pending',
  DONE = 'done',
  WILLNOTDO = 'will-not-do',
}

export class Todo {
  id: number;
  title: string;
  description: string;
  created_by: number;
  status: Status;
}

@Injectable()
export class TasksService {
  constructor(private readonly usersService: UsersService) {}

  private todos: Todo[] = [];

  findOne(todoId: number) {
    const index = this.todos.findIndex((each) => each.id === todoId);
    if (index === -1)
      throw new NotFoundException("The thing isn't found at all");
    return this.todos[index];
  }

  findAll() {
    return this.todos;
  }

  create(userId: number, createTodoInput: Omit<CreateTodoInput, 'created_by'>) {
    const nextIndex = this.todos.length + 1;
    const userExists = this.usersService.users.findIndex(
      (u) => u.id === userId,
    );
    if (userExists === -1) throw new BadRequestException('JPT user halxas!');
    const newTodo = {
      id: nextIndex,
      ...createTodoInput,
      created_by: userId,
      status: Status.PENDING,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  update(updateTodoInput: UpdateTodoInput) {
    const { description, todoId, title, userId } = updateTodoInput;
    const index = this.todos.findIndex((each) => each.id === todoId);
    if (index === -1) throw new NotFoundException('Todo not found!');
    if (this.todos[index].created_by !== userId)
      throw new BadRequestException('Unauthorized access!');
    if (title) this.todos[index].title = title;
    if (description) this.todos[index].description = description;
    return this.todos[index];
  }

  updateToDone(updateToDoToDoneInput: UpdateTodoToDoneInput) {
    const { todoId, userId } = updateToDoToDoneInput;
    const index = this.todos.findIndex((each) => each.id === todoId);
    if (index === -1) throw new NotFoundException('Todo not found!');
    if (this.todos[index].created_by !== userId)
      throw new BadRequestException('Unauthorized access!');
    if (this.todos[index].status !== Status.PENDING)
      throw new BadRequestException('Not in pending state');

    this.todos[index].status = Status.DONE;
    return this.todos[index];
  }

  updateToWillNotDo(updateToDoToWillNotDo: UpdateTodoToWillNotDo) {
    const { todoId, userId } = updateToDoToWillNotDo;
    const index = this.todos.findIndex((each) => each.id === todoId);
    if (index === -1) throw new NotFoundException('Todo not found!');
    if (this.todos[index].created_by !== userId)
      throw new BadRequestException('Unauthorized access!');
    if (this.todos[index].status !== Status.PENDING)
      throw new BadRequestException('Not in pending state');

    this.todos[index].status = Status.WILLNOTDO;
    return this.todos[index];
  }

  updateToWillPending(updateToDoToWillNotDo: UpdateTodoToWillNotDo) {
    const { todoId, userId } = updateToDoToWillNotDo;
    const index = this.todos.findIndex((each) => each.id === todoId);
    if (index === -1) throw new NotFoundException('Todo not found!');
    if (this.todos[index].created_by !== userId)
      throw new BadRequestException('Unauthorized access!');
    if (this.todos[index].status === Status.PENDING)
      throw new BadRequestException('Already in pending state');

    this.todos[index].status = Status.PENDING;
    return this.todos[index];
  }

  delete(deleteTodoInput: DeleteTodoInput) {
    const { todoId, userId } = deleteTodoInput;
    const index = this.todos.findIndex((each) => each.id === todoId);
    if (index === -1) throw new NotFoundException('Todo not found!');
    if (this.todos[index].created_by !== userId)
      throw new BadRequestException('Unauthorized access!');

    const deleted = this.todos[index];
    this.todos = this.todos.filter((todo) => todo.id !== todoId);
    return deleted;
  }
}
