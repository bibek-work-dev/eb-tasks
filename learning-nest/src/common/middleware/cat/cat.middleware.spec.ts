import { CatMiddleware } from './cat.middleware';

describe('CatMiddleware', () => {
  it('should be defined', () => {
    expect(new CatMiddleware()).toBeDefined();
  });
});
