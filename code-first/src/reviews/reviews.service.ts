import { Injectable } from '@nestjs/common';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './reviews.schema';
import { Model } from 'mongoose';
import { GraphQLError } from 'graphql';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async findAll(): Promise<ReviewDocument[]> {
    const result = await this.reviewModel.find();
    return result;
  }

  async findOne(id: string): Promise<ReviewDocument> {
    const result = await this.reviewModel.findById(id);
    if (!result) throw new GraphQLError('Review not found');
    return result;
  }

  async create(
    userId: string,
    createReviewInput: CreateReviewInput,
  ): Promise<ReviewDocument> {
    const result = await this.reviewModel.create({
      user: userId,
      ...createReviewInput,
    });
    return result;
  }

  async update(
    userId: string,
    updateReviewInput: UpdateReviewInput,
  ): Promise<ReviewDocument> {
    const { _id, ...updateData } = updateReviewInput;
    const result = await this.reviewModel
      .findByIdAndUpdate(_id, updateData, { new: true })
      .populate(['user', 'course']);
    if (!result) throw new GraphQLError('Review not found to update');
    return result;
  }

  async remove(userId: string, reviewId: string): Promise<ReviewDocument> {
    const result = await this.reviewModel
      .findByIdAndDelete(reviewId)
      .populate(['user', 'course']);

    if (!result) throw new GraphQLError('Review not found to delete');

    return result;
  }
}
