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

  async createCat(
    userId: string,
    createCatDto: CreateCatDto,
  ): Promise<CatsDocument> {
    const createdCat = new this.catsModel({ ...createCatDto, addedBy: userId });
    return createdCat.save();
  }

  async updateCat(
    id: string,
    userId: string,
    updateCatDto: UpdateCatDto,
  ): Promise<CatsDocument> {
    const updatedCat = await this.catsModel.findById(id);
    if (!updatedCat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    if (updatedCat?.addedBy.toString() !== userId) {
      throw new NotFoundException("You aren't authorized to update this cat");
    }
    updatedCat.set(updateCatDto);
    await updatedCat.save();
    this.loggerService.log('this is updateCat');
    return updatedCat;
  }

  async deleteCat(userId: string, id: string): Promise<CatsDocument> {
    const deletedCat = await this.catsModel.findById(id);
    if (!deletedCat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    if (deletedCat?.addedBy.toString() !== userId) {
      throw new NotFoundException("You aren't authorized to delete this cat");
    }
    await this.catsModel.findByIdAndDelete(id);
    this.loggerService.log('this is deleteCat');
    return deletedCat;
  }
}
