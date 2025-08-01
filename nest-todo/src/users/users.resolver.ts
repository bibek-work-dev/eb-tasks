import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterUserInput } from './dtos/register_user.dto';
import { User } from './users.model';
import { ParseIntPipe } from '@nestjs/common';
import { UpdateUserInput } from './dtos/update_user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  async getUser(@Args('input') userId: string) {
    const result = this.usersService.findOne(userId);
    return result;
  }

  @Query(() => [User])
  async getUsers() {
    const result = this.usersService.findAll();
    return result;
  }

  @Mutation(() => User)
  async createUser(@Args('input') registerUserInput: RegisterUserInput) {
    const result = this.usersService.create(registerUserInput);
    return result;
  }

  @Mutation(() => User)
  async updateUser(@Args('input') updateUserInput: UpdateUserInput) {
    const result = this.usersService.update(updateUserInput);
    return result;
  }

  @Mutation(() => User)
  async deleteUser(@Args('id', ParseIntPipe) userId: number) {
    const result = this.usersService.delete(userId);
    return result;
  }
}
