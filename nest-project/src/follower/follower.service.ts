import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follower, FollowerDocument } from './follower.schema';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from 'src/auth/auth.schema';
import { AcceptFollowRequestDto } from './dto/accept.follow.request.dto';
import { RejectFollowRequestDto } from './dto/reject.follower.request.dto';

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

    if (existing) {
      if (existing.status === 'pending') {
        throw new ConflictException('You already sent a follow request.');
      }
      if (existing.status === 'accepted') {
        throw new ConflictException('You are already following the user.');
      }
      if (existing.status === 'rejected') {
        throw new ConflictException('Your follow request was rejected.');
      }
    }

    const follow = new this.followerModel({
      followerId,
      followingId,
      status: 'pending',
    });

    await follow.save();
    // await this.incrementFollowerCount(followingId);
    // await this.incrementFollowingCount(followerId);
    return follow;
  }

  async acceptFollowRequest(
    userId: string,
    requestId: string,
    acceptFollowRequestDto: AcceptFollowRequestDto,
  ): Promise<FollowerDocument> {
    const { followerId } = acceptFollowRequestDto;
    const followRequest = await this.followerModel.findById(requestId);

    if (!followRequest)
      throw new NotFoundException('No such Follow request was found');

    if (followRequest.status != 'pending')
      throw new ConflictException("It isn't pending for you to accept");

    if (followRequest.followingId.toString() !== userId)
      throw new ForbiddenException(
        'this follow request was intended for other person',
      );

    if (followRequest.followerId.toString() != followerId)
      throw new ForbiddenException('There is conflict who sent the followerId');

    const acceptedRequest = await this.followerModel.findByIdAndUpdate(
      requestId,
      {
        status: 'accepted',
      },
      { new: true },
    );

    if (!acceptedRequest) throw new NotFoundException('Something went wrong!!');

    await this.incrementFollowerCount(userId);
    await this.incrementFollowingCount(followerId);

    return acceptedRequest;
  }

  async rejectFollowRequest(
    userId: string,
    requestId: string,
    rejectFollowRequestDto: RejectFollowRequestDto,
  ): Promise<FollowerDocument> {
    const { followerId } = rejectFollowRequestDto;
    const followRequest = await this.followerModel.findById(requestId);

    if (!followRequest)
      throw new NotFoundException('No Follow REquest to reject');

    if (followRequest.status != 'pending')
      throw new ConflictException("It isn't pending for you to reject");

    if (followRequest.followingId.toString() !== userId)
      throw new ForbiddenException(
        "You aren't allowed to change the other's resources",
      );

    if (followRequest.followerId.toString() != followerId)
      throw new ForbiddenException('There is conflict who sent the followerId');

    const rejectedRequest = await this.followerModel.findByIdAndUpdate(
      requestId,
      {
        status: 'rejected',
      },
      { new: true },
    );

    if (!rejectedRequest) throw new NotFoundException('Something went wrong!!');

    return rejectedRequest;
  }

  async unFollowUserService(
    followerId: string,
    followingId: string,
  ): Promise<FollowerDocument> {
    const result = await this.followerModel.findOneAndDelete({
      followerId,
      followingId,
      status: 'accepted',
    });
    if (!result)
      throw new NotFoundException('You havenot followed the user at all');

    await this.decrementFollowerCount(followingId);
    await this.decrementFollowingCount(followerId);

    return result;
  }

  async getAllFollowRequestService(
    userId: string,
    page: number,
    limit: number,
  ): Promise<FollowerDocument[]> {
    const skip = (page - 1) * limit;
    const requests = await this.followerModel
      .find({ followingId: userId, status: 'pending' })
      .skip(skip)
      .limit(limit)
      .populate('followerId', 'username email');
    return requests;
  }

  async findAllFollowersService(
    userId: string,
    page: number,
    limit: number,
  ): Promise<FollowerDocument[]> {
    const skip = (page - 1) * limit;

    const allFollowers = await this.followerModel
      .find({ followingId: userId, status: 'accepted' })
      .skip(skip)
      .limit(limit)
      .populate('followerId', 'username email');
    return allFollowers;
  }

  async findAllFollowingService(
    userId: string,
    page: number,
    limit: number,
  ): Promise<FollowerDocument[]> {
    const skip = (page - 1) * limit;

    const allFollowing = await this.followerModel
      .find({ followerId: userId, status: 'accepted' })
      .skip(skip)
      .limit(limit)
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
