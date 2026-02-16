import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AnalyticsGateway } from './analytics.gateway';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { Contact } from '../contact/contact.entity';
import { Review } from '../reviews/review.entity';
import { Settings } from './settings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Product,
      Order,
      Contact,
      Review,
      Settings
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AnalyticsGateway],
  exports: [AdminService, AnalyticsGateway],
})
export class AdminModule { }