import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthDocument } from './auth.schema';
import { UpdateUserDto } from './dto/update-user.dto';

type ApiResponse<T> = {
  message: string;
  data: T | null;
};

function createApiResponse<T>(message: string, data: T | null): ApiResponse<T> {
  return { message, data };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  async findAllController(): Promise<ApiResponse<AuthDocument[]>> {
    const users = await this.authService.findAllService();
    return createApiResponse<AuthDocument[]>(
      'All users retrieved successfully',
      users,
    );
  }

  @Get(':id')
  async findOneController(
    @Param('id') id: string,
  ): Promise<ApiResponse<AuthDocument>> {
    const user = await this.authService.findOneService(id);
    return createApiResponse<AuthDocument>('User retrieved successfully', user);
  }

  @Post('register')
  async registerController(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<ApiResponse<AuthDocument>> {
    const user = await this.authService.registerService(registerUserDto);
    return createApiResponse<AuthDocument>(
      'User registered successfully',
      null,
    );
  }

  @Post('login')
  async loginController(@Body() loginUserDto: LoginUserDto): Promise<
    ApiResponse<{
      user: AuthDocument;
      accessToken: string;
      refreshToken: string;
    }>
  > {
    const loggedInUser = await this.authService.loginService(loginUserDto);
    return createApiResponse('User logged In successfully', {
      user: loggedInUser.user,
      accessToken: loggedInUser.accessToken,
      refreshToken: loggedInUser.refreshToken,
    });
  }

  @Patch(':id')
  async updateUserController(
    @Param('id') id: string,
    @Body() updateAuthDto: UpdateUserDto,
  ): Promise<ApiResponse<AuthDocument>> {
    const updatedUser = await this.authService.updateUserService(
      id,
      updateAuthDto,
    );
    return createApiResponse<AuthDocument>(
      'User updated successfully',
      updatedUser,
    );
  }

  @Delete(':id')
  async deleteUserController(
    @Param('id') id: string,
  ): Promise<ApiResponse<AuthDocument>> {
    const deletedUser = await this.authService.deletedUserService(id);
    return createApiResponse<AuthDocument>(
      'User deleted successfully',
      deletedUser,
    );
  }
}
