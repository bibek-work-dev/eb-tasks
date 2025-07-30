import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubjectsService } from './subjects.service';
import { Subject } from './subjects.model';
import { ValidateMongooseIdPipe } from 'src/commons/pipes/validate-mongoose-id/validate-mongoose-id.pipe';
import { CurrentUser } from 'src/commons/decorators/current-user/current-user.decorator';
import { AccessTokenPayload } from 'src/commons/token.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/commons/guards/auth/auth.guard';
import { CreateSubjectInput } from './dto/create-subject.input';
import { UpdateSubjectInput } from './dto/update-subject.input';

@Resolver(() => Subject)
@UseGuards(AuthGuard)
export class SubjectsResolver {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Query(() => [Subject])
  async getSubjects() {
    const result = await this.subjectsService.findAll();
    return result;
  }

  @Query(() => Subject)
  async getSubject(@Args('id', ValidateMongooseIdPipe) subjectId: string) {
    const result = await this.subjectsService.findOne(subjectId);
    return result;
  }

  @Mutation(() => Subject)
  async createSubject(
    @CurrentUser() user: AccessTokenPayload,
    @Args('input') createSubjectInput: CreateSubjectInput,
  ) {
    const createdSubject = await this.subjectsService.create(
      user.userId,
      createSubjectInput,
    );
    return createdSubject;
  }

  @Mutation(() => Subject)
  async updateSubject(
    @CurrentUser() user: AccessTokenPayload,
    @Args('input') updateSubjectInput: UpdateSubjectInput,
  ) {
    const updatedSubject = await this.subjectsService.update(
      user.userId,
      updateSubjectInput,
    );
    return updatedSubject;
  }

  @Mutation(() => Subject)
  async deleteSubject(
    @CurrentUser() user: AccessTokenPayload,
    @Args('id') subjectId: string,
  ) {
    const deletedSubject = await this.subjectsService.remove(
      user.userId,
      subjectId,
    );
    return deletedSubject;
  }
}
