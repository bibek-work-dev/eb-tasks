import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchasedService } from './purchased.service';
import { CreatePurchasedDto } from './dto/create-purchased.dto';
import { UpdatePurchasedDto } from './dto/update-purchased.dto';

@Controller('purchased')
export class PurchasedController {
  constructor(private readonly purchasedService: PurchasedService) {}

  @Post()
  create(@Body() createPurchasedDto: CreatePurchasedDto) {
    return this.purchasedService.create(createPurchasedDto);
  }

  @Get()
  findAll() {
    return this.purchasedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchasedDto: UpdatePurchasedDto) {
    return this.purchasedService.update(+id, updatePurchasedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasedService.remove(+id);
  }
}
