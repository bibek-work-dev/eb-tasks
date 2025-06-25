import { Module } from '@nestjs/common';
import { PurchasedService } from './purchased.service';
import { PurchasedController } from './purchased.controller';

@Module({
  controllers: [PurchasedController],
  providers: [PurchasedService],
})
export class PurchasedModule {}
