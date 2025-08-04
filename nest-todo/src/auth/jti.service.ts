import { Model } from 'mongoose';
import { Jti, JtiDocument } from './jti.schema';
import { InjectModel } from '@nestjs/mongoose';

export class JtiService {
  constructor(@InjectModel(Jti.name) private jtiModel: Model<JtiDocument>) {}

  async isJtiValid(jti: string): Promise<boolean> {
    const record = await this.jtiModel.findOne({ jti, revoked: false }).exec();
    return !!record;
  }

  async storeJti(jti: string, userId: string) {
    await this.jtiModel.create({ jti, userId });
  }

  async revokeJti(jti: string): Promise<void> {
    await this.jtiModel.updateOne({ jti }, { $set: { revoked: true } });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.jtiModel.updateMany({ userId }, { $set: { revoked: true } });
  }
}
