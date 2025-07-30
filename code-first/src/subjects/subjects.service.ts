import { Injectable } from '@nestjs/common';
import { CreateSubjectInput } from './dto/create-subject.input';
import { UpdateSubjectInput } from './dto/update-subject.input';
import { InjectModel } from '@nestjs/mongoose';
import { Subject, SubjectDocument } from './subjects.schema';
import { Model } from 'mongoose';
import { GraphQLError } from 'graphql';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
  ) {}

  async findAll(): Promise<SubjectDocument[]> {
    const allSubject = await this.subjectModel.find();
    return allSubject;
  }

  async findOne(subjectId: string): Promise<SubjectDocument> {
    const subject = await this.subjectModel.findById(subjectId);
    if (!subject) throw new GraphQLError('No such subject found');
    return subject;
  }

  create(
    userId: string,
    createSubjectInput: CreateSubjectInput,
  ): Promise<SubjectDocument> {
    const { title, description } = createSubjectInput;
    const created = new this.subjectModel({
      title,
      description,
      courseId: userId, // You might need to change this based on actual relation
    });
    return created.save();
  }
  async update(
    userId: string,
    updateSubjectInput: UpdateSubjectInput,
  ): Promise<SubjectDocument> {
    const updated = await this.subjectModel.findByIdAndUpdate(
      updateSubjectInput._id,
      {
        title: updateSubjectInput.title,
        content: updateSubjectInput.description,
      },
      { new: true },
    );

    if (!updated) throw new GraphQLError('Subject not found or not updated');
    return updated;
  }

  async remove(userId: string, subjectId: string): Promise<SubjectDocument> {
    const deleted = await this.subjectModel.findByIdAndDelete(subjectId);
    if (!deleted)
      throw new GraphQLError('Subject not found or already deleted');
    return deleted;
  }
}
