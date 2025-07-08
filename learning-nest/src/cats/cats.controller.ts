import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { LoggerService } from 'src/logs/logs.service';
import { CatsDocument } from './cats.schema';
import { CreateCatDto } from './dtos/create-cat.dto';
import { UpdateCatDto } from './dtos/update-cat.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
  findAllCats(): Promise<CatsDocument[]> {
    return this.catsService.findAllCats();
  }

  @Post('create')
  createCat(@Body() createCatDto: CreateCatDto): Promise<CatsDocument> {
    return this.catsService.createCat(createCatDto);
  }

  @Patch(':id')
  updateCat(
    @Param('id') id: string,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<CatsDocument> {
    return this.catsService.updateCat(id, updateCatDto);
  }

  @Delete(':id')
  deleteCat(@Param('id') id: string): Promise<CatsDocument> {
    return this.catsService.deleteCat(id);
  }
}
