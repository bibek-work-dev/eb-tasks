import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ValidateMongooseIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value))
      throw new BadRequestException('Invalid Id format');
    return value;
  }
}
