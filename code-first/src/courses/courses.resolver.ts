import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course } from './courses.model';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/commons/guards/auth/auth.guard';
import { CurrentUser } from 'src/commons/decorators/current-user/current-user.decorator';
import { AccessTokenPayload } from 'src/commons/token.service';
import { ValidateMongooseIdPipe } from 'src/commons/pipes/validate-mongoose-id/validate-mongoose-id.pipe';
import { User } from 'src/users/users.model';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Query(() => Course)
  async getCourse(@Args('id', ValidateMongooseIdPipe) courseId: string) {
    const result = await this.coursesService.getCourse(courseId);
    return result;
  }

  @Query(() => [Course])
  async getCourses() {
    const result = await this.coursesService.getCourses();
    console.log('it was here');
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Course)
  async createCourse(
    @CurrentUser() user: AccessTokenPayload,
    @Args('input') createCourseInput: CreateCourseInput,
  ) {
    const { userId } = user;
    const result = await this.coursesService.createCourse(
      userId,
      createCourseInput,
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Course)
  async enrollInCourser(
    @CurrentUser() user: AccessTokenPayload,
    @Args('input') courserId: string,
  ) {
    const { userId } = user;
    const enrolledCourse = await this.coursesService.enrollInCourse(
      userId,
      courserId,
    );
    return enrolledCourse;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Course)
  async updateCourse(
    @CurrentUser() user: AccessTokenPayload,
    updateCourseInput: UpdateCourseInput,
  ) {
    const { userId } = user;
    const result = await this.coursesService.updateCourse(
      userId,
      updateCourseInput,
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Course)
  async deleteCourse(
    @CurrentUser() user: AccessTokenPayload,
    @Args('id') courseId: string,
  ) {
    const { userId } = user;
    const result = await this.coursesService.deleteCourse(userId, courseId);
    return result;
  }

  @ResolveField(() => User, { name: 'instructor' })
  async instructor(@Parent() course: Course) {
    console.log('course', course);
    const instructor = await this.coursesService.getInstructor(
      course.instructor.toString(),
    );
    console.log('instructor', instructor);
    return instructor;
  }
}
