import { Module } from '@nestjs/common';

import { CatsModule } from './cats/cats.module';
import { UserModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { PurchasedModule } from './purchased/purchased.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:root@cluster0.1ay18rg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    CatsModule,
    UserModule,
    OrdersModule,
    ProductsModule,
    PurchasedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
