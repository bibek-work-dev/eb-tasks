import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserRepository } from './repo/users.repository';

@Injectable()
export class UsersService {
  constructor(
    // @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // return 'This is create Repo';
    const createdUser = await this.userRepository.create(createUserDto);
    return createdUser.save();
  }

  findAllWithoutAggreation(page, limit) {
    // return 'This is fidnAllWithoutAggregation';
    return this.userRepository.findAllWithoutAggregation(page, limit);
  }

  findAllWithAggreation(page, limit) {
    // return 'This si findAllWithaggregation';
    return this.userRepository.findAllWithAggregation(page, limit);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
