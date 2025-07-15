import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ValidateMongooseObjectIdPipe implements PipeTransform {
  transform(value: string | undefined, metadata: ArgumentMetadata) {
    if (!value || !mongoose.isValidObjectId(value)) {
      throw new BadRequestException('Bad ObjectId thrown');
    }
    return value;
  }
}
