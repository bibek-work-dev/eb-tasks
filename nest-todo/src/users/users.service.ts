import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserInput } from './dtos/register_user.dto';
import { UpdateUserInput } from './dtos/update_user.dto';

export class User {
  id: number;
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor() {}
  users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(userId: number) {
    const user = this.users.find((each) => each.id === userId);
    if (!user) throw new NotFoundException('No such user found');
    return user;
  }

  create(registerUserInput: RegisterUserInput) {
    const nextId = this.users.length + 1;
    const newUser = { id: nextId, ...registerUserInput };
    this.users.push(newUser);
    return newUser;
  }

  update(updateUserInput: UpdateUserInput) {
    const { username, userId } = updateUserInput;
    const index = this.users.findIndex((user) => user.id === userId);
    if (index === -1) throw new NotFoundException('User not found');

    if (username) this.users[index].username = updateUserInput.username;
    return this.users[index];
  }

  delete(userId: number) {
    const toDeleteIndex = this.users.findIndex((each) => each.id == userId);
    console.log('deletedUser', toDeleteIndex);
    if (toDeleteIndex === -1)
      throw new NotFoundException('No such user found to be deleted');

    const deletedUser = this.users[toDeleteIndex];
    this.users = this.users.filter((each) => each.id !== userId);
    return deletedUser;
  }
}
