import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserInput } from './dtos/update_user.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { AccessTokenPayload } from 'src/commons/types/token-payload.types';
import { GetUserResponse } from './responses/get_user.response';
import { GetUsersInput } from './dtos/get_user.input';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    console.log('this is the user service');
  }

  async findAll(input: GetUsersInput): Promise<GetUserResponse> {
    const { page, limit } = input;
    const skip = (page - 1) * limit;

    const [notUsingLean, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).lean().exec(),
      this.userModel.countDocuments().exec(),
    ]);

    const usersWithId = notUsingLean.map((user) => ({
      ...user,
      id: user._id.toString(),
    }));

    return {
      users: usersWithId,
      paginate: {
        page,
        limit,
        total,
        hasNextPage: page * limit < total,
      },
    };
  }

  async findOne(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) throw new NotFoundException('No such user found');
    return user;
  }

  async update(
    currentUser: AccessTokenPayload,
    updateUserInput: UpdateUserInput,
  ): Promise<UserDocument> {
    const { userId, email } = currentUser;
    const { username } = updateUserInput;

    console.log('parameter', currentUser, updateUserInput);

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
