import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './users.model';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { UpdateUserInput } from './dtos/update_user.dto';
// import { JwtAuthGuard } from 'src/commons/guards/jwt/jwt.guard';
import { CurrentUser } from 'src/commons/decorators/current_user/current_user.decorator';
import { AccessTokenPayload } from 'src/commons/types/token-payload.types';
import { JwtAuthGuard } from 'src/commons/guards/jwt/jwt.guard';

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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() currentUser: AccessTokenPayload,
    @Args('input') updateUserInput: UpdateUserInput,
  ) {
    console.log('currentUser in resolver', currentUser);
    const result = await this.usersService.update(updateUserInput);
    return result;
  }

  @Mutation(() => User)
  async deleteUser(@Args('id', ParseIntPipe) userId: number) {
    const result = await this.usersService.delete(userId);
    return result;
  }
}
