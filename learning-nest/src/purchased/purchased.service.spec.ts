import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedService } from './purchased.service';

describe('PurchasedService', () => {
  let service: PurchasedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasedService],
    }).compile();

    service = module.get<PurchasedService>(PurchasedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
