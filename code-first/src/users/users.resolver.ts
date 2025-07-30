import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './users.model';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/commons/guards/auth/auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user/current-user.decorator';
import { AccessTokenPayload } from 'src/commons/token.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async getUsers() {
    console.log('here');
    const result = this.usersService.findAll();
    return result;
  }

  @Query(() => User)
  async getUser(@Args('id') id: string) {
    console.log('here', id);
    const result = await this.usersService.findById(id);
    return result;
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async deleteUser(
    @CurrentUser() user: AccessTokenPayload,
    @Args('id') id: string,
  ) {
    const { userId } = user;
    const result = await this.usersService.deleteUser(user.userId, id);
    return result;
  }
}
