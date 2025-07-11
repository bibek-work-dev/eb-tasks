import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument, AuthSchema } from './auth.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly AuthModel: Model<AuthDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async registerService(
    registerUserDto: RegisterUserDto,
  ): Promise<AuthDocument> {
    const existingUser = await this.AuthModel.findOne({
      email: registerUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
    const newUser = new this.AuthModel({
      ...registerUserDto,
      password: hashedPassword,
    });
    await newUser.save();
    return newUser;
  }

  async loginService(loginUserDto: LoginUserDto): Promise<{
    user: AuthDocument;
    accessToken: string;
    refreshToken: string;
  }> {
    const { email, password } = loginUserDto;
    const user = await this.AuthModel.findOne({ email });
    if (!user) {
      throw new ConflictException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid email or password');
    }
    const { accessToken, refreshToken } = await this.generateTokens(user);
    return { user, accessToken, refreshToken };
  }

  async findAllService(): Promise<AuthDocument[]> {
    const users = await this.AuthModel.find({}).exec();
    return users;
  }

  async findOneService(id: string): Promise<AuthDocument> {
    const user = await this.AuthModel.findById(id);
    if (!user) {
      throw new ConflictException('User not found');
    }
    return user;
  }

  async updateUserService(
    id: string,
    updateAuthDto: any,
  ): Promise<AuthDocument> {
    const toBeUpdatedUser = await this.AuthModel.findByIdAndUpdate(
      id,
      updateAuthDto,
      { new: true },
    );
    if (!toBeUpdatedUser) {
      throw new ConflictException('User not found');
    }
    return toBeUpdatedUser;
  }

  async deletedUserService(id: string): Promise<AuthDocument> {
    const deletedUser = await this.AuthModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new ConflictException('User not found');
    }
    return deletedUser;
  }

  private async generateAccessToken(user: AuthDocument): Promise<string> {
    const payload = { id: user._id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_JWT_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_JWT_EXPIRESIN,
    });
    return accessToken;
  }

  private async generateRefreshToken(user: AuthDocument): Promise<string> {
    const payload = { id: user._id, email: user.email };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_JWT_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_JWT_EXPIRESIN,
    });
    return refreshToken;
  }

  private async generateTokens(user: AuthDocument): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }
}
