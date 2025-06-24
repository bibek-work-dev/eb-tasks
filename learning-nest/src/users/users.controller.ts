import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UserDocument } from './users.schema';
import { createUserDto } from './dtos/create-user.dto';
import { create } from 'domain';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDocument> {
    return this.userService.getUser(id);
  }

  @Get()
  getAllUsers(): Promise<UserDocument[]> {
    return this.userService.getAllUser();
  }

  @Post('register')
  register(@Body() createUserDto: createUserDto): Promise<UserDocument> {
    return this.userService.registerUser(createUserDto);
  }

  @Post('login')
  login(): string {
    return this.userService.loginUser();
  }

  @Patch(':id')
  updateUser(): string {
    return this.userService.updateUser();
  }

  @Delete(':id')
  deleteUser(): string {
    console.log('delete');
    return this.userService.deleteUser();
  }
}
