import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ProductVariation } from './variation.entity';
import { Brand } from '../brands/brand.entity';
import { CloudinaryService } from '../uploads/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductVariation, Brand])],
  controllers: [ProductsController],
  providers: [ProductsService, CloudinaryService], // Add CloudinaryService
  exports: [ProductsService],
})
export class ProductsModule { }