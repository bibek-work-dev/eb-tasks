import { ValidateMongooseIdPipe } from './validate-mongoose-id.pipe';

describe('ValidateMongooseIdPipe', () => {
  it('should be defined', () => {
    expect(new ValidateMongooseIdPipe()).toBeDefined();
  });
});
