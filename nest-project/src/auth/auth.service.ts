import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument, AuthSchema } from './auth.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { AppJwtPayload } from 'src/common/types/jwtpayload';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
      refreshToken: null,
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

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();
    return { user, accessToken, refreshToken };
  }

  async findAllService(): Promise<AuthDocument[]> {
    const users = await this.AuthModel.find({}).exec();
    return users;
  }

  async findOneService(id: string): Promise<AuthDocument> {
    const user = await this.AuthModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getMeUserService(userId: string): Promise<AuthDocument> {
    const user = await this.AuthModel.findById(userId);
    if (!user) throw new NotFoundException('You seeems to be not available');
    return user;
  }

  async refreshTokenService(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: any }> {
    const { refreshToken } = refreshTokenDto;
    let decoded: AppJwtPayload;
    try {
      decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('invalid or expired refresh');
    }
    const userFromRefreshToken = await this.AuthModel.findById(decoded.id);
    if (!userFromRefreshToken || !userFromRefreshToken.refreshToken)
      throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(
      refreshToken,
      userFromRefreshToken.refreshToken,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(userFromRefreshToken);

    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    userFromRefreshToken.refreshToken = hashedNewRefreshToken;
    await userFromRefreshToken.save();
    return { accessToken, refreshToken: newRefreshToken };
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

  private getTokenPayload(user: AuthDocument): AppJwtPayload {
    const payload = {
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role,
    };
    return payload;
  }

  private async generateAccessToken(user: AuthDocument): Promise<string> {
    const payload = this.getTokenPayload(user);
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_JWT_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_JWT_EXPIRESIN,
    });
    return accessToken;
  }

  private async generateRefreshToken(user: AuthDocument): Promise<string> {
    const payload = this.getTokenPayload(user);
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
