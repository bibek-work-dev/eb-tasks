import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { LoggerService } from 'src/logs/logs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { catsSchema } from './cats.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cat', schema: catsSchema }])],
  controllers: [CatsController],
  providers: [CatsService, LoggerService],
})
export class CatsModule {}
