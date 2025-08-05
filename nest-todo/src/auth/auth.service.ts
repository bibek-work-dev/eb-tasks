import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserInput } from './dtos/register-user.input';
import { User, UserDocument } from 'src/users/users.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginUserInput } from './dtos/login-user.input';
import * as bcryptjs from 'bcryptjs';
import { TokenService } from 'src/commons/services/token.service';
import { AccessTokenPayload } from 'src/commons/types/token-payload.types';
import { Jti, JtiDocument } from './jti.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Jti.name) private jtiModel: Model<JtiDocument>,
    private readonly tokenService: TokenService,
  ) {
    console.log('this is the auth service');
  }

  async getMe(user: AccessTokenPayload): Promise<UserDocument> {
    const { userId } = user;
    const existingUser = await this.userModel.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return existingUser;
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
    const { email, password } = loginUserInput;
    const user = await this.userModel.findOne({ email });
    console.log('user', user);

    if (!user) {
      throw new NotFoundException('No such user found');
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    console.log('password Match', passwordMatch);
    if (!passwordMatch) {
      throw new ConflictException("Credentials don't match");
    }

    const jti = this.tokenService.generateJti();

    const accessToken = this.tokenService.createAccessToken(
      {
        userId: (user._id as Types.ObjectId).toString(),
        email: user.email,
      },
      jti,
    );

    const refreshToken = this.tokenService.createRefreshToken({
      userId: (user._id as Types.ObjectId).toString(),
      email: user.email,
    });

    console.log('access_token', accessToken);
    console.log('refreshToken', refreshToken);

    const deletedJti = await this.jtiModel.findOneAndDelete({
      userId: user._id,
    });

    if (!deletedJti) {
      console.log('there is no jti in model');
      // throw new InternalServerErrorException('There is no jti in model');
    }

    console.log(
      'this is jti saved',
      await this.jtiModel.create({
        jti,
        userId: user._id,
      }),
    );

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.loggedInTimes = (user.loggedInTimes ?? 0) + 1;
    await user.save();

    return {
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshAccessToken(oldRefreshToken: string) {
    const payload = this.tokenService.verifyRefreshToken(oldRefreshToken);
    const user = await this.userModel.findById(payload.userId).exec();
    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const revokedToken = await this.jtiModel
      .deleteOne({ userId: payload.userId })
      .exec();

    console.log('revoked Token', revokedToken);

    if (!revokedToken) {
      throw new UnauthorizedException("YOu don't have token to revoke");
    }

    const newJti = this.tokenService.generateJti();

    const accessToken = this.tokenService.createAccessToken(
      {
        userId: payload.userId,
        email: payload.email,
      },
      newJti,
    );

    await this.jtiModel.create({
      jti: newJti,
      userId: payload.userId,
    });

    return {
      access_token: accessToken,
      refresh_token: user.refreshToken,
      user,
    };
  }

  async logoutUser(user: AccessTokenPayload): Promise<String> {
    const { email, jti, userId } = user;
    if (!jti) {
      throw new BadRequestException('Missing token ID (jti)');
    }
    const revokedToken = await this.jtiModel.deleteOne({ jti, userId }).exec();

    if (!revokedToken) {
      throw new BadRequestException('No such token found');
    }
    return 'Logout successfull';
  }
}
