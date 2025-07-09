import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ValidateMongooseIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    console.log('value', value);
    if (!isValidObjectId(value)) {
      console.log('here it was');
      throw new BadRequestException('Invalid ObjectId format');
    }
    return value;
  }
}
