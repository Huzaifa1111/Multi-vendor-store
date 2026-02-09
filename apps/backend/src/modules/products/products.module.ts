import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ProductVariation } from './variation.entity';
import { Attribute, AttributeValue } from './attribute.entity';
import { Brand } from '../brands/brand.entity';
import { CloudinaryService } from '../uploads/cloudinary.service';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductVariation, Brand, Attribute, AttributeValue])],
  controllers: [ProductsController, AttributesController],
  providers: [ProductsService, AttributesService, CloudinaryService],
  exports: [ProductsService, AttributesService],
})
export class ProductsModule { }