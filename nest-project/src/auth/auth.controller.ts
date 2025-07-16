import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthDocument } from './auth.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiResponse } from 'src/common/types/response';
import { createApiResponse } from 'src/common/utils/response';
import { User } from 'src/common/decorators/user/user.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { ValidateMongooseObjectIdPipe } from 'src/common/pipes/validate.mongoose.object-id/validate.mongoose.object-id.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  async findAllController(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<ApiResponse<{ users: AuthDocument[]; total: number }>> {
    console.log('first and last', page, limit);
    const users = await this.authService.findAllService(page, limit);
    return createApiResponse('All users retrieved successfully', users);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMeController(
    @User('id') userId: string,
  ): Promise<ApiResponse<AuthDocument>> {
    const getMe = await this.authService.getMeUserService(userId);
    return createApiResponse('You are it', getMe);
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
  @UseGuards(AuthGuard)
  async updateUserController(
    @Param('id', ValidateMongooseObjectIdPipe) id: string,
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
  @UseGuards(AuthGuard)
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
