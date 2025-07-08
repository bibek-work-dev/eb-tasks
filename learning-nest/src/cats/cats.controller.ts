import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { LoggerService } from 'src/logs/logs.service';
import { CatsDocument } from './cats.schema';
import { CreateCatDto } from './dtos/create-cat.dto';
import { UpdateCatDto } from './dtos/update-cat.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { User } from 'src/common/decorators/user/user.decorator';
import { LoggerInterceptor } from 'src/common/interceptors/logger/logger.interceptor';

@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggerInterceptor)
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
  createCat(
    @User('id') userId: string,
    @Body() createCatDto: CreateCatDto,
  ): Promise<CatsDocument> {
    return this.catsService.createCat(userId, createCatDto);
  }

  @Patch(':id')
  updateCat(
    @User('id') userId: string,
    @Param('id') catId: string,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<CatsDocument> {
    return this.catsService.updateCat(catId, userId, updateCatDto);
  }

  @Delete(':id')
  deleteCat(
    @User('id') userId: string,
    @Param('id') catId: string,
  ): Promise<CatsDocument> {
    return this.catsService.deleteCat(userId, catId);
  }
}
