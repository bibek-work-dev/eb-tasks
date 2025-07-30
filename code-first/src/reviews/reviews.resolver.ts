import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { Review } from './reviews.model';
import { ValidateMongooseIdPipe } from 'src/commons/pipes/validate-mongoose-id/validate-mongoose-id.pipe';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/commons/guards/auth/auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user/current-user.decorator';
import { AccessTokenPayload } from 'src/commons/token.service';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Query(() => [Review])
  async getReviews() {
    const result = await this.reviewsService.findAll();
    return result;
  }

  @Query(() => Review)
  async getReview(@Args('id', ValidateMongooseIdPipe) id: string) {
    const result = await this.reviewsService.findOne(id);
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Review)
  async createReview(
    @CurrentUser() user: AccessTokenPayload,
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ) {
    const result = await this.reviewsService.create(
      user.userId,
      createReviewInput,
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Review)
  async updateReview(
    @CurrentUser() user: AccessTokenPayload,
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ) {
    const result = await this.reviewsService.update(
      user.userId,
      updateReviewInput,
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Review)
  async deleteReview(
    @CurrentUser() user: AccessTokenPayload,
    @Args('id', ValidateMongooseIdPipe) id: string,
  ) {
    const result = await this.reviewsService.remove(user.userId, id);
    return result;
  }
}
