import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UserDocument } from './users.schema';
import { registerUserDto } from './dtos/register-user.dto';
import { loginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from 'src/common/decorators/user/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { ApiResponse } from 'src/common/types/api.response.interface';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@User('id') userId: string): Promise<ApiResponse<UserDocument>> {
    const user = await this.userService.getUser(userId);
    return {
      data: user,
      message: 'User fetched successfully',
    };
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<ApiResponse<UserDocument>> {
    const user = await this.userService.getUser(id);
    return {
      data: user,
      message: 'User fetched successfully',
    };
  }

  @Get()
  async getAllUsers(): Promise<ApiResponse<UserDocument[]>> {
    const users = await this.userService.getAllUser();
    return {
      data: users,
      message: 'All users fetched successfully',
    };
  }

  @Post('register')
  async register(
    @Body() registerUserDto: registerUserDto,
  ): Promise<ApiResponse<UserDocument>> {
    const userCreated = await this.userService.registerUser(registerUserDto);
    return {
      data: userCreated,
      message: 'User registered successfully',
    };
  }

  @Post('login')
  async login(
    @Body() loginUserDto: loginUserDto,
  ): Promise<ApiResponse<{ user: any; token: string }>> {
    const loginUser = await this.userService.loginUser(loginUserDto);
    return {
      message: 'User logged in successfully',
      data: {
        user: loginUser.user,
        token: loginUser.token,
      },
    };
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<UserDocument>> {
    const user = await this.userService.updateUser(id, updateUserDto);
    return {
      data: user,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
  ): Promise<ApiResponse<UserDocument>> {
    const user = await this.userService.deleteUser(id);
    return {
      data: user,
      message: 'User deleted successfully',
    };
  }
}
