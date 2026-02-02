import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Product } from '../products/product.entity';
import { AddToCartDto, UpdateCartItemDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async getCart(userId: number) {
    const cartItems = await this.cartItemRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Get product and variation details for each cart item
    const cartWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.productId },
          relations: ['variations', 'brand']
        });

        let variation: any = null;
        if (item.variationId && product?.variations) {
          variation = product.variations.find(v => v.id === item.variationId) || null;
        }

        return {
          ...item,
          product: product || null,
          variation: variation,
        };
      })
    );

    return cartWithProducts;
  }

  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    const { productId, quantity, variationId } = addToCartDto;

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['variations']
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check variation if provided
    let variation: any = null;
    if (variationId) {
      variation = product.variations?.find(v => v.id === variationId);
      if (!variation) {
        throw new NotFoundException('Variation not found');
      }
    }

    // Check stock
    const availableStock = variation ? variation.stock : product.stock;
    if (availableStock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Check if item already in cart with same variation
    const existingCartItem = await this.cartItemRepository.findOne({
      where: {
        userId,
        productId,
        variationId: variationId ? variationId : undefined
      } as any,
    });

    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += quantity;
      return await this.cartItemRepository.save(existingCartItem);
    }

    // Create new cart item
    const cartItem = this.cartItemRepository.create({
      userId,
      productId,
      variationId: variationId ? variationId : undefined,
      quantity,
      price: variation ? variation.price : product.price,
    } as any);

    return await this.cartItemRepository.save(cartItem);
  }

  async updateCartItem(userId: number, itemId: number, updateCartDto: UpdateCartItemDto) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, userId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Get product to check stock
    const product = await this.productRepository.findOne({
      where: { id: cartItem.productId },
    });

    if (product && product.stock < updateCartDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    cartItem.quantity = updateCartDto.quantity;
    return await this.cartItemRepository.save(cartItem);
  }

  async removeFromCart(userId: number, itemId: number) {
    const result = await this.cartItemRepository.delete({
      id: itemId,
      userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }

    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: number) {
    await this.cartItemRepository.delete({ userId });
    return { message: 'Cart cleared' };
  }

  async getCartCount(userId: number) {
    const result = await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .select('SUM(cart_item.quantity)', 'count')
      .where('cart_item.userId = :userId', { userId })
      .getRawOne();

    return parseInt(result.count) || 0;
  }

  async getCartTotal(userId: number) {
    const cartItems = await this.cartItemRepository.find({
      where: { userId },
    });

    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
}