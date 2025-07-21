import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './auth.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { AppJwtPayload } from 'src/common/types/jwtpayload';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Post, PostDocument } from 'src/posts/posts.schema';
import { Comment, CommentDocument } from 'src/comments/comments.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly AuthModel: Model<AuthDocument>,
    @InjectModel(Post.name) private readonly PostModel: Model<PostDocument>,
    @InjectModel(Comment.name)
    private readonly CommentModel: Model<CommentDocument>,

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
    const user = await this.AuthModel.findOne({ email }).select('+password');
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

  async findAllService(
    page: number,
    limit: number,
  ): Promise<{ users: AuthDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.AuthModel.find({}).skip(skip).limit(limit).exec(),
      this.AuthModel.countDocuments(),
    ]);
    return { total, users };
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
        secret: process.env.REFRESH_TOKEN_JWT_SECRET || 'refresh-token',
      });
      console.log('decoded', decoded);
    } catch (error) {
      throw new UnauthorizedException('invalid or expired refresh');
    }
    const userFromRefreshToken = await this.AuthModel.findById(
      decoded.id,
    ).select('+refreshToken');
    console.log('user From Refresh Token', userFromRefreshToken);
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
    userIdFromToken: string,
    userIdFromParam: string,
    updateAuthDto: any,
  ): Promise<AuthDocument> {
    if (userIdFromParam != userIdFromToken)
      throw new ForbiddenException("Don't try to update others");
    const toBeUpdatedUser = await this.AuthModel.findByIdAndUpdate(
      userIdFromParam,
      updateAuthDto,
      { new: true },
    );
    if (!toBeUpdatedUser) {
      throw new ConflictException('User not found');
    }
    return toBeUpdatedUser;
  }

  async logoutUserService(userId: string) {
    const loggedOutUser = await this.AuthModel.findByIdAndUpdate(
      userId,
      {
        refreshToken: '',
      },
      { new: true },
    );
    return loggedOutUser;
  }

  async deletedUserService(
    userIdFromToken: string,
    userIdFromParam: string,
  ): Promise<AuthDocument> {
    if (userIdFromParam != userIdFromToken)
      throw new ForbiddenException("Don't try to delete Others");
    const deletedUser = await this.AuthModel.findByIdAndDelete(userIdFromParam);
    if (!deletedUser) {
      throw new ConflictException('User not found');
    }
    await this.PostModel.deleteMany({ authorId: userIdFromParam });
    await this.CommentModel.deleteMany({ authorId: userIdFromParam });
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
