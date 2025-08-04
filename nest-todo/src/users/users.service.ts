import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserInput } from './dtos/update_user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    console.log('this is the user service');
  }

  async findAll(): Promise<UserDocument[]> {
    const result = await this.userModel.find().exec();
    return result;
  }

  async findOne(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) throw new NotFoundException('No such user found');
    return user;
  }

  async update(updateUserInput: UpdateUserInput): Promise<UserDocument> {
    const { userId, username } = updateUserInput;

    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');

    if (username) user.username = username;

    return user.save();
  }

  async delete(userId: number): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndDelete(userId).exec();
    if (!user) throw new NotFoundException('No such user found to be deleted');
    return user;
  }
}
