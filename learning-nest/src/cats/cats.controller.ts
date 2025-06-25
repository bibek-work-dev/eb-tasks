import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CatsService } from './cats.service';
import { LoggerService } from 'src/logs/logs.service';
import { UserDocument } from 'src/users/users.schema';
import { CatsDocument } from './cats.schema';

@Controller('cats')
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly loggerService: LoggerService,
  ) {}
  @Get(':id')
  findCat(@Param('id') id: string): Promise<CatsDocument> {
    this.loggerService.log('this is invoked in cats Service in loggerService');
    return this.catsService.findCat(id);
  }

  @Get()
  findAllCats(): string {
    return this.catsService.findAllCat();
  }

  @Post('create')
  createCat(): string {
    return this.catsService.createCat();
  }

  @Patch(':id')
  updateCat(): string {
    return this.catsService.updateCat();
  }

  @Delete(':id')
  deleteCat(): string {
    return this.catsService.deleteCat();
  }
}
