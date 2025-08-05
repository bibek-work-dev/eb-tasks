import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './users.model';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { UpdateUserInput } from './dtos/update_user.input';
import { CurrentUser } from 'src/commons/decorators/current_user/current_user.decorator';
import { AccessTokenPayload } from 'src/commons/types/token-payload.types';
import { JwtAuthGuard } from 'src/commons/guards/jwt/jwt.guard';
import { GetUserResponse } from './responses/get_user.response';
import { GetUsersInput } from './dtos/get_user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  async getUser(@Args('input') userId: string) {
    const result = this.usersService.findOne(userId);
    return result;
  }

  @Query(() => GetUserResponse)
  async getUsers(@Args('input') input: GetUsersInput) {
    const result = this.usersService.findAll(input);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() currentUser: AccessTokenPayload,
    @Args('input') updateUserInput: UpdateUserInput,
  ) {
    console.log('currentUser in resolver', currentUser);
    const result = await this.usersService.update(currentUser, updateUserInput);
    return result;
  }

  @Mutation(() => User)
  async deleteUser(@Args('id', ParseIntPipe) userId: number) {
    const result = await this.usersService.delete(userId);
    return result;
  }
}
