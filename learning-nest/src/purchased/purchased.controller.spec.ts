import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedController } from './purchased.controller';
import { PurchasedService } from './purchased.service';

describe('PurchasedController', () => {
  let controller: PurchasedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasedController],
      providers: [PurchasedService],
    }).compile();

    controller = module.get<PurchasedController>(PurchasedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
