import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';
import { CartModule } from '../cart/cart.module';
import { StripeService } from './stripe.service'; // Add this import

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product]),
    CartModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, StripeService],
  exports: [OrdersService],
})
export class OrdersModule { }