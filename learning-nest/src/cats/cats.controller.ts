import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { LoggerService } from 'src/logs/logs.service';
import { CatsDocument } from './cats.schema';
import { CreateCatDto } from './dtos/create-cat.dto';
import { UpdateCatDto } from './dtos/update-cat.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { User } from 'src/common/decorators/user/user.decorator';
import { ApiResponse } from 'src/common/types/api.response.interface';
import { ValidateMongooseIdPipe } from 'src/common/pipes/validate-mongoose-id/validate-mongoose-id.pipe';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { EnumRole, Roles } from 'src/common/decorators/roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
// @UsePipes(ValidateMongooseIdPipe)
@Controller('cats')
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get(':id')
  async findCat(
    @Param('id', ValidateMongooseIdPipe) id: string,
  ): Promise<ApiResponse<CatsDocument>> {
    console.log('id here', id);
    const cat = await this.catsService.findCat(id);
    return {
      message: 'Cat fetched successfully',
      data: cat,
    };
  }

  @Get()
  async findAllCats(): Promise<ApiResponse<CatsDocument[]>> {
    const cats = await this.catsService.findAllCats();
    return {
      message: 'All cats fetched successfully',
      data: cats,
    };
  }

  @Post('create')
  async createCat(
    @User('id') userId: string,
    @Body() createCatDto: CreateCatDto,
  ): Promise<ApiResponse<CatsDocument>> {
    const createdCat = await this.catsService.createCat(userId, createCatDto);
    return {
      message: 'Cat created successfully',
      data: createdCat,
    };
  }

  @Patch(':id')
  async updateCat(
    @User('id') userId: string,
    @Param('id', ValidateMongooseIdPipe) catId: string,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<ApiResponse<CatsDocument>> {
    const updatedCat = await this.catsService.updateCat(
      catId,
      userId,
      updateCatDto,
    );
    return {
      message: 'Cat updated successfully',
      data: updatedCat,
    };
  }

  @Delete(':id')
  @Roles(EnumRole.ADMIN)
  async deleteCat(
    @User('id') userId: string,
    @Param('id', ValidateMongooseIdPipe) catId: string,
  ): Promise<ApiResponse<CatsDocument>> {
    const deletedCat = await this.catsService.deleteCat(userId, catId);
    return {
      data: deletedCat,
      message: 'Cat deleted successfully',
    };
  }
}
