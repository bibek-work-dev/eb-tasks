import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './users.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async getUsers() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  async getUser(@Args('id') id: string) {
    const result = await this.usersService.findById(id);
    return result;
  }

  @Mutation(() => User)
  async deleteUser(@Args('id') id: string) {
    const result = await this.usersService.deleteUser(id);
    return result;
  }
}
