import { Test, TestingModule } from '@nestjs/testing';
import { LikeDislikeService } from './like-dislike.service';

describe('LikeDislikeService', () => {
  let service: LikeDislikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikeDislikeService],
    }).compile();

    service = module.get<LikeDislikeService>(LikeDislikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
