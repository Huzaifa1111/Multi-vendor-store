// apps/backend/src/modules/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto'; // ADD THIS IMPORT
import { CloudinaryService } from '../uploads/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createProductDto: CreateProductDto, image?: Express.Multer.File): Promise<any> {
    console.log('Creating product:', createProductDto);
    console.log('Image received:', image ? `Type: ${image.mimetype}, Size: ${image.size}` : 'No image');
    
    let imageUrl: string | undefined = undefined;
    
    if (image) {
      try {
        imageUrl = await this.cloudinaryService.uploadImage(image);
        console.log('Image uploaded to Cloudinary:', imageUrl);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }

    const productData: Partial<Product> = {
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      stock: createProductDto.stock,
      category: createProductDto.category || 'Uncategorized',
      featured: createProductDto.featured || false, // ADD THIS LINE
    };

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

  async findAll(filters?: ProductFilterDto): Promise<Product[]> { // UPDATE THIS METHOD
    const query = this.productRepository.createQueryBuilder('product');
    
    if (filters?.category) {
      query.andWhere('product.category = :category', { category: filters.category });
    }
    
    if (filters?.featured !== undefined) {
      query.andWhere('product.featured = :featured', { featured: filters.featured });
    }
    
    if (filters?.minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }
    
    if (filters?.maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }
    
    if (filters?.search) {
      query.andWhere('(product.name LIKE :search OR product.description LIKE :search)', {
        search: `%${filters.search}%`,
      });
    }
    
    query.orderBy('product.createdAt', 'DESC');
    
    if (filters?.limit) {
      query.limit(filters.limit);
    }
    
    return query.getMany();
  }

  async findFeaturedProducts(limit?: number): Promise<Product[]> { // ADD THIS METHOD
    const query = this.productRepository
      .createQueryBuilder('product')
      .where('product.featured = :featured', { featured: true })
      .orderBy('product.createdAt', 'DESC');
    
    if (limit) {
      query.limit(limit);
    }
    
    return query.getMany();
  }

  async getCategories(): Promise<string[]> { // ADD THIS METHOD
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('product.category IS NOT NULL')
      .getRawMany();
    
    return categories.map(c => c.category);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async update(id: number, updateProductDto: any): Promise<Product> {
    // ADD featured to update data
    const updateData: any = { ...updateProductDto };
    if (updateProductDto.featured !== undefined) {
      updateData.featured = updateProductDto.featured;
    }
    
    await this.productRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}