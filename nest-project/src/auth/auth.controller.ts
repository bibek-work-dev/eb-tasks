import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthDocument } from './auth.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiResponse } from 'src/common/types/response';
import { createApiResponse } from 'src/common/utils/response';

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

  @Post('refresh')
  async refreshTokenController(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    const tokens = await this.authService.refreshTokenService(refreshTokenDto);
    return createApiResponse('Token refreshed sucessfully', tokens);
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
