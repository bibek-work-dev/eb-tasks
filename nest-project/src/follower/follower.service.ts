import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follower, FollowerDocument } from './follower.schema';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from 'src/auth/auth.schema';

@Injectable()
export class FollowerService {
  constructor(
    @InjectModel(Follower.name) private followerModel: Model<FollowerDocument>,
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
  ) {}

  async followUserService(
    followerId: string,
    followingId: string,
  ): Promise<FollowerDocument> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself.');
    }

    const doesTheFollowerExists =
      await this.ensureUserExistAndReturnUserIfExists(
        followingId,
        "The User you want to follow doesn't exists",
      );
    const existing = await this.followerModel.findOne({
      followerId,
      followingId,
    });
    console.log('follow exits or not', existing);

    if (existing)
      throw new ConflictException('You are already following the user. ');

    const follow = new this.followerModel({
      followerId,
      followingId,
    });

    await follow.save();
    await this.incrementFollowerCount(followingId);
    await this.incrementFollowingCount(followerId);
    return follow;
  }

  async unFollowUserService(
    followerId: string,
    followingId: string,
  ): Promise<FollowerDocument> {
    const result = await this.followerModel.findOneAndDelete({
      followerId,
      followingId,
    });
    if (!result)
      throw new NotFoundException('You havenot followed the user at all');

    await this.decrementFollowerCount(followingId);
    await this.decrementFollowingCount(followerId);

    return result;
  }

  async findAllFollowersService(userId: string): Promise<FollowerDocument[]> {
    const followers = await this.followerModel
      .find({ followingId: userId })
      .populate('followerId', 'username email');
    return followers;
  }

  async findAllFollowingService(userId: string): Promise<FollowerDocument[]> {
    const allFollowing = await this.followerModel
      .find({ followerId: userId })
      .populate('followingId', 'username email');
    return allFollowing;
  }
  private async incrementFollowerCount(userId: string) {
    await this.authModel.findByIdAndUpdate(userId, {
      $inc: { followerCount: 1 },
    });
  }

  private async incrementFollowingCount(userId: string) {
    await this.authModel.findByIdAndUpdate(userId, {
      $inc: { followingCount: 1 },
    });
  }

  private async decrementFollowerCount(userId: string) {
    await this.authModel.findByIdAndUpdate(userId, {
      $inc: { followerCount: -1 },
    });
  }

  private async decrementFollowingCount(userId: string) {
    await this.authModel.findByIdAndUpdate(userId, {
      $inc: { followingCount: -1 },
    });
  }

  private async ensureUserExistAndReturnUserIfExists(
    userId: string,
    message?: string,
  ) {
    const user = await this.authModel.findById(userId);
    if (!user) {
      throw new NotFoundException(message || 'No Such users found');
    }
    return user;
  }
}
