// apps/backend/src/modules/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariation } from './variation.entity';
import { Brand } from '../brands/brand.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
<<<<<<< HEAD
=======
import { Category } from '../categories/category.entity';
>>>>>>> 221541e6fdbf0d393ceb818dab6c65a5d3209dce
import { CloudinaryService } from '../uploads/cloudinary.service';
import { Category } from '../categories/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductVariation)
    private variationRepository: Repository<ProductVariation>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private cloudinaryService: CloudinaryService,
  ) { }

  private async getOrCreateCategory(name: string): Promise<Category> {
    let category = await this.categoryRepository.findOne({ where: { name } });
    if (!category) {
      category = this.categoryRepository.create({ name });
      category = await this.categoryRepository.save(category);
    }
    return category;
  }

  async create(createProductDto: CreateProductDto, images?: Express.Multer.File[]): Promise<any> {
    console.log('Creating product:', createProductDto);
    console.log('Images received:', images ? images.length : 0);

    const imageUrls: string[] = [];

    if (images && images.length > 0) {
      try {
        for (const image of images) {
          const url = await this.cloudinaryService.uploadImage(image);
          imageUrls.push(url);
        }
        console.log('Images uploaded to Cloudinary:', imageUrls);
      } catch (error) {
        console.error('Failed to upload images:', error);
        throw new Error('Failed to upload images to Cloudinary');
      }
    }

    const productData: Partial<Product> = {
      name: createProductDto.name,
      description: createProductDto.description,
      longDescription: createProductDto.longDescription,
      shippingPolicy: createProductDto.shippingPolicy,
      returnPolicy: createProductDto.returnPolicy,
      price: createProductDto.price,
      stock: createProductDto.stock,
      sku: createProductDto.sku,
<<<<<<< HEAD
      category: await this.getOrCreateCategory(createProductDto.category || 'Uncategorized'),
=======
      category: createProductDto.categoryId ? { id: createProductDto.categoryId } as any : undefined,
>>>>>>> 221541e6fdbf0d393ceb818dab6c65a5d3209dce
      featured: createProductDto.featured || false,
      images: imageUrls,
      descriptionImages: createProductDto.descriptionImages || [],
    };

    if (createProductDto.brandId) {
      productData.brand = { id: createProductDto.brandId } as Brand;
    }

    if (createProductDto.upsellIds) {
      productData.upsells = createProductDto.upsellIds.map(id => ({ id } as Product));
    }

    if (createProductDto.crossSellIds) {
      productData.crossSells = createProductDto.crossSellIds.map(id => ({ id } as Product));
    }

    const product = this.productRepository.create(productData as Product);
    const savedProduct = await this.productRepository.save(product);

    if (createProductDto.variations && createProductDto.variations.length > 0) {
      for (const vDto of createProductDto.variations) {
        const variation = this.variationRepository.create({
          ...vDto,
          product: savedProduct,
          attributeValues: vDto.attributeValueIds ? vDto.attributeValueIds.map(id => ({ id })) : [],
        } as any);
        await this.variationRepository.save(variation);
      }
    }

    return {
      message: 'Product created successfully',
      data: await this.findOne(savedProduct.id),
    };
  }

  async findAll(filters?: ProductFilterDto): Promise<Product[]> { // UPDATE THIS METHOD
    const query = this.productRepository.createQueryBuilder('product');

    if (filters?.category) {
      query.leftJoin('product.category', 'category')
        .andWhere('category.name = :category', { category: filters.category });
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

    query.leftJoinAndSelect('product.brand', 'brand');
    query.leftJoinAndSelect('product.variations', 'variations');
    query.orderBy('product.createdAt', 'DESC');

    if (filters?.limit) {
      query.limit(filters.limit);
    }

    return query.getMany();
  }

  async findFeaturedProducts(limit?: number): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.variations', 'variations')
      .where('product.featured = :featured', { featured: true })
      .orderBy('product.createdAt', 'DESC');

    if (limit) {
      query.limit(limit);
    }

    return query.getMany();
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.categoryRepository.find();
    return categories.map(c => c.name);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand', 'category', 'variations', 'variations.attributeValues', 'variations.attributeValues.attribute', 'upsells', 'crossSells']
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: any, images?: Express.Multer.File[]): Promise<Product> {
    const product = await this.findOne(id);

    const imageUrls: string[] = product.images || [];

    if (images && images.length > 0) {
      try {
        for (const image of images) {
          const url = await this.cloudinaryService.uploadImage(image);
          imageUrls.push(url);
        }
        console.log('New images uploaded to Cloudinary:', imageUrls);
      } catch (error) {
        console.error('Failed to upload new images:', error);
        throw new Error('Failed to upload new images to Cloudinary');
      }
    }

    const updateData: any = { ...updateProductDto };

    if (updateProductDto.category) {
      updateData.category = await this.getOrCreateCategory(updateProductDto.category);
    }

    // Handle types
    if (updateProductDto.price !== undefined) {
      const p = parseFloat(updateProductDto.price);
      updateData.price = isNaN(p) ? 0 : p;
    }
    if (updateProductDto.stock !== undefined) {
      const s = parseInt(updateProductDto.stock);
      updateData.stock = isNaN(s) ? 0 : s;
    }

    if (updateProductDto.shippingPolicy !== undefined) {
      updateData.shippingPolicy = updateProductDto.shippingPolicy;
    }

    if (updateProductDto.returnPolicy !== undefined) {
      updateData.returnPolicy = updateProductDto.returnPolicy;
    }

    if (updateProductDto.brandId) {
      updateData.brand = { id: updateProductDto.brandId };
    }

    if (updateProductDto.upsellIds) {
      updateData.upsells = updateProductDto.upsellIds.map(id => ({ id } as Product));
    }

    if (updateProductDto.crossSellIds) {
      updateData.crossSells = updateProductDto.crossSellIds.map(id => ({ id } as Product));
    }

    updateData.images = imageUrls;

    if (updateProductDto.categoryId !== undefined) {
      updateData.category = updateProductDto.categoryId ? { id: updateProductDto.categoryId } : null;
    }

    if (updateProductDto.descriptionImages !== undefined) {
      updateData.descriptionImages = updateProductDto.descriptionImages;
    }

    // Variations handling for update
    if (updateProductDto.variations) {
      await this.variationRepository.delete({ product: { id } });
      for (const vDto of updateProductDto.variations) {
        const variation = this.variationRepository.create({
          ...vDto,
          product: { id } as Product,
          attributeValues: vDto.attributeValueIds ? vDto.attributeValueIds.map(id => ({ id })) : [],
        } as any);
        await this.variationRepository.save(variation);
      }
      delete updateData.variations;
    }

    await this.productRepository.save({ id, ...updateData });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}