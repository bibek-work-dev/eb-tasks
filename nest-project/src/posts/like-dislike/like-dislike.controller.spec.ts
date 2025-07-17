import { Test, TestingModule } from '@nestjs/testing';
import { LikeDislikeController } from './like-dislike.controller';
import { LikeDislikeService } from './like-dislike.service';

describe('LikeDislikeController', () => {
  let controller: LikeDislikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeDislikeController],
      providers: [LikeDislikeService],
    }).compile();

    controller = module.get<LikeDislikeController>(LikeDislikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
