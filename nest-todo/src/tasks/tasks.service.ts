import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoInput } from './dtos/create_todo.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateTodoInput } from './dtos/update_todo.dto';
import { UpdateTodoToDoneInput } from './dtos/update_todo_to_done.dto';
import { UpdateTodoToWillNotDoInput } from './dtos/update_todo_to_willnotdo.dto';
import { DeleteTodoInput } from './dtos/delete_todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoDocument } from './tasks.schema';
import { Todo } from './tasks.model';
import { UpdateTodoToPendingInput } from './dtos/update_todo_to_pending.dto';

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

  async findAll(): Promise<TodoDocument[]> {
    return this.todoModel.find().exec();
  }

  async create(createTodoInput: CreateTodoInput): Promise<TodoDocument> {
    const { description, title, userId } = createTodoInput;
    const user = await this.usersService.findOne(userId);
    if (!user) throw new BadRequestException('User not found');

    const createdTodo = new this.todoModel({
      ...createTodoInput,
      userId: userId,
      status: Status.PENDING,
    });

    return createdTodo.save();
  }

  async update(updateTodoInput: UpdateTodoInput) {
    const { todoId, userId, title, description } = updateTodoInput;
    const todo = await this.findOne(todoId);

    if (todo.userId.toString() !== userId)
      throw new BadRequestException('Unauthorized access');

    if (title) todo.title = title;
    if (description) todo.description = description;

    return todo.save();
  }

  async updateToDone(updateToDoToDoneInput: UpdateTodoToDoneInput) {
    const { todoId, userId } = updateToDoToDoneInput;
    const todo = await this.findOne(todoId);

    if (todo.userId.toString() !== userId)
      throw new BadRequestException('Unauthorized access');

    if (todo.status !== Status.PENDING)
      throw new BadRequestException('Not in pending state');

    todo.status = Status.DONE;
    return todo.save();
  }

  async updateToWillNotDo(
    updateToDoToWillNotDo: UpdateTodoToWillNotDoInput,
  ): Promise<TodoDocument> {
    const { todoId, userId } = updateToDoToWillNotDo;
    const todo = await this.findOne(todoId);

    if (todo.userId.toString() !== userId)
      throw new BadRequestException('Unauthorized access');

    if (todo.status !== Status.PENDING)
      throw new BadRequestException('Not in pending state');

    todo.status = Status.WILLNOTDO;
    return todo.save();
  }

  async updateToWillPending(
    updateToDoToPendingInput: UpdateTodoToPendingInput,
  ): Promise<TodoDocument> {
    const { todoId, userId } = updateToDoToPendingInput;
    const todo = await this.findOne(todoId);

    if (todo.userId.toString() !== userId)
      throw new BadRequestException('Unauthorized access');

    if (todo.status === Status.PENDING)
      throw new BadRequestException('Already in pending state');

    todo.status = Status.PENDING;
    return todo.save();
  }

  async delete(deleteTodoInput: DeleteTodoInput): Promise<TodoDocument> {
    const { todoId, userId } = deleteTodoInput;
    const todo = await this.todoModel.findById(todoId);

    if (!todo) throw new NotFoundException('No such todo found');

    if (todo.userId.toString() != userId)
      throw new BadRequestException('Unauthorized access');

    const updatedTodo = await this.todoModel.findByIdAndDelete(todoId).exec();
    if (!updatedTodo) throw new NotFoundException('No such todo found');
    return updatedTodo;
  }
}
