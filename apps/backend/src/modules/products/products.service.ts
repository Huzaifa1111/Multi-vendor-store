import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from '../uploads/cloudinary.service'; // Add this import

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cloudinaryService: CloudinaryService, // Add this
  ) {}

  // In products.service.ts, update the create method:
async create(createProductDto: CreateProductDto, image?: Express.Multer.File): Promise<any> {
  console.log('Creating product:', createProductDto);
  console.log('Image received:', image ? `Type: ${image.mimetype}, Size: ${image.size}` : 'No image');
  
  let imageUrl: string | undefined = undefined;  // Use undefined instead of null
  
  // Upload image to Cloudinary if provided
  if (image) {
    try {
      imageUrl = await this.cloudinaryService.uploadImage(image);
      console.log('Image uploaded to Cloudinary:', imageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      // Keep as undefined if upload fails
    }
  }

  // Create product entity
  const productData: Partial<Product> = {
    name: createProductDto.name,
    description: createProductDto.description,
    price: createProductDto.price,
    stock: createProductDto.stock,
    category: createProductDto.category || 'Uncategorized',
  };

  // Only add image if it exists
  if (imageUrl) {
    productData.image = imageUrl;
  }

  const product = this.productRepository.create(productData as Product);
  const savedProduct = await this.productRepository.save(product);
  
  return {
    message: 'Product created successfully',
    data: savedProduct,
  };
}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async update(id: number, updateProductDto: any): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}