import { Controller, Get, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('test')
  test() {
    return { 
      message: 'Products API is working!', 
      timestamp: new Date().toISOString(),
      status: 'OK'
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    console.log('=== PRODUCT CREATE REQUEST ===');
    console.log('Body:', createProductDto);
    console.log('Image:', image ? `Filename: ${image.originalname}, Size: ${image.size} bytes` : 'No image');
    
    try {
      const result = await this.productsService.create(createProductDto, image);
      return result;
    } catch (error) {
      console.error('Error creating product:', error);
      return { error: 'Internal server error' };
    }
  }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }
}