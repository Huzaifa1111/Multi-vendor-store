import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { CartModule } from '../cart/cart.module'; // Add this import

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    CartModule, // Add this line
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}