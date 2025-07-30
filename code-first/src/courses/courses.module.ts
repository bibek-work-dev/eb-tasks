import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './courses.schema';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/users.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [CoursesResolver, CoursesService],
})
export class CoursesModule {}
