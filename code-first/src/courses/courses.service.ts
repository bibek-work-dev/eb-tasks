import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './courses.schema';
import { Model, Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { UsersService } from 'src/users/users.service';
import { User, UserDocument } from 'src/users/users.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    private readonly userService: UsersService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getCourse(courseId: string): Promise<CourseDocument> {
    const course = await this.courseModel.findById(courseId);
    if (!course) throw new GraphQLError('No such course founded');
    return course;
  }

  async getCourses(): Promise<CourseDocument[]> {
    console.log('in serivice');
    const result = await this.courseModel.find();
    console.log('result', result);
    return result;
  }

  async createCourse(
    userId: string,
    createCourseInput: CreateCourseInput,
  ): Promise<CourseDocument> {
    const courseCreated = await this.courseModel.create({
      instructor: userId,
      ...createCourseInput,
    });
    return courseCreated;
  }

  async enrollInCourse(
    userId: string,
    courseId: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("The user with id isn't found");
    const course = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');
    const alreadyEnrolled = user.enrolledCourse.some(
      (enrolledId) => enrolledId.toString() === courseId,
    );
    if (alreadyEnrolled) {
      throw new BadRequestException('User already enrolled in this course');
    }
    user.enrolledCourse.push(new Types.ObjectId(courseId));
    user.save();
    return user;
  }

  async updateCourse(
    userId: string,
    updateCouseInput: UpdateCourseInput,
  ): Promise<CourseDocument> {
    const { _id: courserId, ...updateData } = updateCouseInput;
    const toBeUpdatedCourse = await this.courseModel.findById(courserId);
    if (!toBeUpdatedCourse)
      throw new GraphQLError('Course not found to update');
    await this.ensureCourseOwnerShip(toBeUpdatedCourse, userId);
    const updatedCourse = await this.courseModel.findByIdAndUpdate(
      courserId,
      updateData,
      { new: true },
    );
    if (!updatedCourse) throw new GraphQLError('No such course founded');
    return updatedCourse;
  }

  async deleteCourse(
    userId: string,
    courseId: string,
  ): Promise<CourseDocument> {
    console.log('courseId', courseId);
    const toBeDeletedCourse = await this.courseModel.findById(courseId);
    console.log('toBeDeletedCousre', toBeDeletedCourse);
    if (!toBeDeletedCourse) throw new GraphQLError('No such thing to delete');
    await this.ensureCourseOwnerShip(toBeDeletedCourse, userId);
    await this.courseModel.findByIdAndDelete(courseId);
    return toBeDeletedCourse;
  }

  private async ensureCourseOwnerShip(
    toBeUpdatedCourse: CourseDocument,
    userId: string,
  ) {
    const { instructor } = toBeUpdatedCourse;
    if (instructor.toString() !== userId) {
      throw new GraphQLError(
        "You aren't allowed to changed the course added by others",
      );
    }
    return toBeUpdatedCourse;
  }

  // get Users
  async getInstructor(instrctorId: string) {
    return this.userService.findById(instrctorId);
  }
}
