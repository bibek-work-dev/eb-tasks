import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { GraphQLError } from 'graphql';
import { UpdateUserInput } from '../auth/dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new GraphQLError('Here done');
    return user;
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    const { email, username } = updateUserInput;
    const user = await this.userModel.findByIdAndUpdate();
    if (!user) throw new GraphQLError('Not Found');
    return user;
  }

  async deleteUser(userId: string, id: string): Promise<User> {
    if (userId !== id) throw new GraphQLError('You have no access to that');
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) throw new GraphQLError('No such thing to delete');
    return deletedUser;
  }
}
