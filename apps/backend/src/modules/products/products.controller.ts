// apps/backend/src/modules/products/products.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Patch,
  UseInterceptors, 
  UploadedFile,
  NotFoundException,
  Query // ADD THIS IMPORT
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto'; // ADD THIS IMPORT
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
  console.log('Featured field:', createProductDto.featured); // ADD THIS LINE
  console.log('Featured type:', typeof createProductDto.featured); // ADD THIS LINE
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
  async findAll(@Query() filters?: ProductFilterDto) { // UPDATE THIS METHOD
    if (filters?.featured !== undefined || filters?.category || filters?.search) {
      return this.productsService.findAll(filters);
    }
    return this.productsService.findAll();
  }

  @Get('featured') // ADD THIS ENDPOINT
  async findFeatured(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : undefined;
    return this.productsService.findFeaturedProducts(limitNum);
  }

  @Get('categories') // ADD THIS ENDPOINT
  async getCategories() {
    const categories = await this.productsService.getCategories();
    return { categories };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.productsService.findOne(parseInt(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

@Patch(':id')
@UseInterceptors(FileInterceptor('image'))
async update(
  @Param('id') id: string,
  @Body() updateProductDto: any,
  @UploadedFile() image?: Express.Multer.File,
) {
    console.log('=== PRODUCT UPDATE REQUEST ===');
  console.log('Product ID:', id);
  console.log('Body:', updateProductDto);
  console.log('Featured value:', updateProductDto.featured); // ADD THIS LINE
  console.log('Featured type:', typeof updateProductDto.featured); // ADD THIS LINE
    
    try {
      await this.productsService.findOne(parseInt(id));
      
      const updateData: any = {};
      if (updateProductDto.name) updateData.name = updateProductDto.name;
      if (updateProductDto.description) updateData.description = updateProductDto.description;
      if (updateProductDto.price) updateData.price = parseFloat(updateProductDto.price);
      if (updateProductDto.stock) updateData.stock = parseInt(updateProductDto.stock);
      if (updateProductDto.category) updateData.category = updateProductDto.category;
      if (updateProductDto.featured !== undefined) updateData.featured = updateProductDto.featured === 'true' || updateProductDto.featured === true; // ADD THIS LINE
      
      if (image) {
        // TODO: Upload to Cloudinary and get URL
        updateData.image = `/uploads/${image.originalname}`; // Temporary
      }
      
      const updatedProduct = await this.productsService.update(parseInt(id), updateData);
      return {
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      console.error('Error updating product:', error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return { error: 'Internal server error' };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.productsService.findOne(parseInt(id));
      
      await this.productsService.remove(parseInt(id));
      return { 
        success: true,
        message: 'Product deleted successfully' 
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }
}