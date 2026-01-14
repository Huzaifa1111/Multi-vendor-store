import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CloudinaryService } from '../uploads/cloudinary.service'; // Add this

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService, CloudinaryService], // Add CloudinaryService
  exports: [ProductsService],
})
export class ProductsModule {}