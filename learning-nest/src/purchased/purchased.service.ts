import { Injectable } from '@nestjs/common';
import { CreatePurchasedDto } from './dto/create-purchased.dto';
import { UpdatePurchasedDto } from './dto/update-purchased.dto';

@Injectable()
export class PurchasedService {
  create(createPurchasedDto: CreatePurchasedDto) {
    return 'This action adds a new purchased';
  }

  findAll() {
    return `This action returns all purchased`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchased`;
  }

  update(id: number, updatePurchasedDto: UpdatePurchasedDto) {
    return `This action updates a #${id} purchased`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchased`;
  }
}
