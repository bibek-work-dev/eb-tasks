import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserInput } from './dtos/register-user.input';
import { User, UserDocument } from 'src/users/users.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginUserInput } from './dtos/login-user.input';
import * as bcryptjs from 'bcryptjs';
import { TokenService } from 'src/commons/services/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly tokenService: TokenService,
  ) {
    console.log('this is the auth service');
  }

  async validateUser(email: string, password: string) {
    console.log('validateUser service');
    const user = await this.userModel.findOne({ email });
    console.log('user', user);
    if (!user) return null;
    const passwordMatch = await bcryptjs.compare(password, user.password);
    console.log('password Match', passwordMatch);
    if (!passwordMatch) return null;
    const { password: _, ...userWithoutPassword } = user.toObject();
    userWithoutPassword._id = user._id;
    return userWithoutPassword;
  }

  async register(registerUserInput: RegisterUserInput): Promise<UserDocument> {
    const { email, password, username } = registerUserInput;

    if (!email || !username || !password) {
      throw new BadRequestException(
        'Email, username, and password are required',
      );
    }

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const createdUser = new this.userModel({
      ...registerUserInput,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async login(loginUserInput: LoginUserInput) {
    const user = await this.validateUser(
      loginUserInput.email,
      loginUserInput.password,
    );
    console.log('lgoin data', user);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const accessToken = this.tokenService.createAccessToken({
      userId: (user._id as Types.ObjectId).toString(),
      email: user.email,
    });

    const refreshToken = this.tokenService.createRefreshToken({
      userId: (user._id as Types.ObjectId).toString(),
      email: user.email,
    });

    console.log('access_token', accessToken);
    console.log('refreshToken', refreshToken);

    return {
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
