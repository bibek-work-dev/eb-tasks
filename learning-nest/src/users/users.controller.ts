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
import { registerUserDto } from './dtos/register-user.dto';
import { loginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDocument> {
    console.log('get user by id', id);
    return this.userService.getUser(id);
  }

  @Get()
  getAllUsers(): Promise<UserDocument[]> {
    return this.userService.getAllUser();
  }

  @Post('register')
  register(@Body() registerUserDto: registerUserDto): Promise<UserDocument> {
    console.log('registeruser', registerUserDto);
    return this.userService.registerUser(registerUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: loginUserDto): Promise<{
    user: any;
    // user: Omit<UserDocument, 'password'>;
    token: string;
  }> {
    return this.userService.loginUser(loginUserDto);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<UserDocument> {
    return this.userService.deleteUser(id);
  }
}
