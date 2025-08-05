import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoInput } from './dtos/create_todo.input';
import { UsersService } from 'src/users/users.service';
import { UpdateTodoInput } from './dtos/update_todo.input';
import { UpdateTodoToDoneInput } from './dtos/update_todo_to_done.input';
import { UpdateTodoToWillNotDoInput } from './dtos/update_todo_to_willnotdo.input';
import { DeleteTodoInput } from './dtos/delete_todo.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoDocument } from './tasks.schema';
import { Todo } from './tasks.model';
import { UpdateTodoToPendingInput } from './dtos/update_todo_to_pending.input';
import { AccessTokenPayload } from 'src/commons/types/token-payload.types';
import { GetTodoInput } from './dtos/get_todo.input';

export enum Status {
  PENDING = 'pending',
  DONE = 'done',
  WILLNOTDO = 'will-not-do',
}

@Injectable()
export class TasksService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
  ) {}

  async findOne(todoId: string): Promise<TodoDocument> {
    const todo = await this.todoModel.findById(todoId).exec();
    if (!todo) throw new NotFoundException("The todo isn't found");
    return todo;
  }

  async findAll(
    userFromToken: AccessTokenPayload,
    filter?: GetTodoInput,
  ): Promise<TodoDocument[]> {
    const { userId } = userFromToken;
    let query: any = { userId };
    console.log('query in findAll', filter);

    if (filter?.status) {
      const { status } = filter;
      query.status = status;
    }

    return this.todoModel.find(query).exec();
  }

  async create(
    userFromToken: AccessTokenPayload,
    createTodoInput: CreateTodoInput,
  ): Promise<TodoDocument> {
    const { email, userId } = userFromToken;
    const { description, title } = createTodoInput;
    const user = await this.usersService.findOne(userId);
    if (!user) throw new BadRequestException('User not found');

    const createdTodo = new this.todoModel({
      ...createTodoInput,
      userId: userId,
      status: Status.PENDING,
    });

    return createdTodo.save();
  }

  async update(
    userFromToken: AccessTokenPayload,
    updateTodoInput: UpdateTodoInput,
  ) {
    const { userId } = userFromToken;
    const { todoId, title, description } = updateTodoInput;
    const todo = await this.findOne(todoId);

    if (todo.userId.toString() !== userId)
      throw new BadRequestException('Unauthorized access');

    if (title) todo.title = title;
    if (description) todo.description = description;

    return todo.save();
  }

  async updateToDone(
    userFromToken: AccessTokenPayload,
    updateToDoToDoneInput: UpdateTodoToDoneInput,
  ) {
    const { userId } = userFromToken;
    const { todoId } = updateToDoToDoneInput;
    const todo = await this.findOne(todoId);

    if (todo.userId.toString() !== userId)
      throw new BadRequestException('Unauthorized access');

    if (todo.status !== Status.PENDING)
      throw new BadRequestException('Not in pending state');

    todo.status = Status.DONE;
    return todo.save();
  }

  async updateToWillNotDo(
    userFromToken: AccessTokenPayload,

    updateToDoToWillNotDo: UpdateTodoToWillNotDoInput,
  ): Promise<TodoDocument> {
    const { userId } = userFromToken;
    const { todoId } = updateToDoToWillNotDo;
    const todo = await this.findOne(todoId);

    if (todo.userId.toString() !== userId)
      throw new BadRequestException('Unauthorized access');

    if (todo.status !== Status.PENDING)
      throw new BadRequestException('Not in pending state');

    todo.status = Status.WILLNOTDO;
    return todo.save();
  }

  async updateToWillPending(
    userFromToken: AccessTokenPayload,
    updateToDoToPendingInput: UpdateTodoToPendingInput,
  ): Promise<TodoDocument> {
    const { userId } = userFromToken;
    const { todoId } = updateToDoToPendingInput;
    const todo = await this.findOne(todoId);

    if (todo.userId.toString() !== userId)
      throw new BadRequestException('Unauthorized access');

    if (todo.status === Status.PENDING)
      throw new BadRequestException('Already in pending state');

    todo.status = Status.PENDING;
    return todo.save();
  }

  async delete(
    userFromToken: AccessTokenPayload,
    deleteTodoInput: DeleteTodoInput,
  ): Promise<TodoDocument> {
    const { userId } = userFromToken;
    const { todoId } = deleteTodoInput;
    const todo = await this.todoModel.findById(todoId);

    if (!todo) throw new NotFoundException('No such todo found');

    if (todo.userId.toString() != userId)
      throw new BadRequestException('Unauthorized access');

    const updatedTodo = await this.todoModel.findByIdAndDelete(todoId).exec();
    if (!updatedTodo) throw new NotFoundException('No such todo found');
    return updatedTodo;
  }
}
