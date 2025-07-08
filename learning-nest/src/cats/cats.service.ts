import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from 'src/logs/logs.service';
import { CatsDocument } from './cats.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCatDto } from './dtos/create-cat.dto';
import { UpdateCatDto } from './dtos/update-cat.dto';

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

  async findAllCats(): Promise<CatsDocument[]> {
    const cats = await this.catsModel.find().exec();
    return cats;
  }

  async createCat(createCatDto: CreateCatDto): Promise<CatsDocument> {
    const createdCat = new this.catsModel(createCatDto);
    return createdCat.save();
  }

  async updateCat(
    id: string,
    updateCatDto: UpdateCatDto,
  ): Promise<CatsDocument> {
    const updatedCat = await this.catsModel.findByIdAndUpdate(
      id,
      updateCatDto,
      {
        new: true,
      },
    );
    if (!updatedCat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    this.loggerService.log('this is updateCat');
    return updatedCat;
  }

  async deleteCat(id: string): Promise<CatsDocument> {
    const deletedCat = await this.catsModel.findByIdAndDelete(id);
    if (!deletedCat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    this.loggerService.log('this is deleteCat');
    return deletedCat;
  }
}
