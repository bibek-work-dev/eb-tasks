import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './users.model';
import { UsersService } from './users.service';
import { CreateUserInput } from './dtos/create-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async getUsers() {
    return this.usersService.findAll();
  }

  @Mutation(() => User)
  async createUserController(@Args('input') createUserInput: CreateUserInput) {
    console.log('createUserInput', createUserInput);
    const newlyCreatedUser = await this.usersService.create(createUserInput);
    return newlyCreatedUser;
  }
}
