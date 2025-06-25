import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './users.schema';
import { createUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { create } from 'node:domain';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async getUser(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('The user with such id is not found');
    }
    return user;
  }

  async getAllUser(): Promise<UserDocument[]> {
    const users = await this.userModel.find({});
    return users;
  }

  async registerUser(createUserDto: createUserDto): Promise<UserDocument> {
    const alreadyExists = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (alreadyExists) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.createBcryptPassword(
      createUserDto.password,
    );

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return user;
  }

  loginUser(): string {
    return 'This is to login the User';
  }

  updateUser(): string {
    return 'This is to update the user';
  }

  deleteUser(): string {
    return 'This is to delete the user';
  }

  private async createBcryptPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async comparePassword() {}
}
