import { Module } from '@nestjs/common';

import { CatsModule } from './cats/cats.module';
import { UserModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:root@cluster0.1ay18rg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    CatsModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
