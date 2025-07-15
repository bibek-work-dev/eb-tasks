import { ValidateMongooseObjectIdPipe } from './validate.mongoose.object-id.pipe';

describe('ValidateMongooseObjectIdPipe', () => {
  it('should be defined', () => {
    expect(new ValidateMongooseObjectIdPipe()).toBeDefined();
  });
});
