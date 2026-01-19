import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Product,  // Add this
      Order     // Add this
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}