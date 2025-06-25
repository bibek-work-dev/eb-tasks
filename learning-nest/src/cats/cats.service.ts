import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from 'src/logs/logs.service';
import { CatsDocument } from './cats.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel('Cat') private catsModel: Model<CatsDocument>,
    private readonly loggerService: LoggerService,
  ) {}

  async findCat(id: string): Promise<CatsDocument> {
    this.loggerService.log('this is findCat');
    const cat = await this.catsModel.findById(id);

    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    return cat;
  }

  findAllCat(): string {
    return 'This is to return all cat';
  }

  createCat(): string {
    return 'This create a cat';
  }

  updateCat(): string {
    return 'This updates a cat';
  }

  deleteCat(): string {
    return 'This is to delete the cat';
  }
}
