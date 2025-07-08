import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './users.schema';
import * as bcrypt from 'bcrypt';
import { loginUserDto } from './dtos/login-user.dto';
import { registerUserDto } from './dtos/register-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoggerService } from 'src/logs/logs.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private loggerService: LoggerService,
  ) {}

  async getUser(id: string): Promise<UserDocument> {
    this.loggerService.log(`Fetching user with id: ${id}`);
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('The user with such id is not found');
    }
    return user;
  }

  async getAllUser(): Promise<UserDocument[]> {
    this.loggerService.log('Fetching all users');
    const users = await this.userModel.find({});
    return users;
  }

  async registerUser(registerUserDto: registerUserDto): Promise<UserDocument> {
    const alreadyExists = await this.userModel.findOne({
      email: registerUserDto.email,
    });

    if (alreadyExists) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.createBcryptPassword(
      registerUserDto.password,
    );

    console.log('hashed passwrod', hashedPassword, alreadyExists);

    const user = await this.userModel.create({
      ...registerUserDto,
      password: hashedPassword,
    });

    console.log('User created:', user);
    if (!user) {
      throw new ConflictException('User registration failed');
    }
    return user;
  }

  async loginUser(
    loginUserDto: loginUserDto,
  ): Promise<{ user: any; token: string }> {
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }
    const JWT_SECRET = process.env.JWT_SECRET || 'my-secret';
    const JWT_EXPIRESIN: any = process.env.JWT_EXPIRESIN || '1d';
    console.log('JWT_SECRET', JWT_SECRET, JWT_EXPIRESIN);
    const { password, ...userWithoutPassword } = user.toObject();
    const token = await jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRESIN,
      },
    );

    console.log('user logged in', token, userWithoutPassword);

    return { user: userWithoutPassword, token };
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    this.loggerService.log(`Updating user with id: ${id}`);
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );
    if (!updatedUser) {
      throw new ConflictException('User update failed');
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<UserDocument> {
    this.loggerService.log(`Deleting user with id: ${id}`);
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async createBcryptPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async comparePassword() {}
}
