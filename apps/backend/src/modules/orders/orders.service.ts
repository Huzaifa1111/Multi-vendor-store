import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { StripeService } from './stripe.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cartService: CartService,
    private stripeService: StripeService,
  ) { }

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    // Get cart items
    const cartItems = await this.cartService.getCart(userId);

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty. Please add items before checkout.');
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Generate professional order number (e.g., ORD-20240210-ABCD)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${dateStr}-${randomStr}`;

    // Create order
    const order = this.orderRepository.create({
      userId,
      orderNumber,
      total,
      shippingAddress: createOrderDto.shippingAddress,
      paymentMethod: createOrderDto.paymentMethod,
      status: OrderStatus.PENDING,
    });

    // Handle Stripe Payment
    if (createOrderDto.paymentMethod === 'stripe') {
      if (!createOrderDto.paymentIntentId) {
        throw new Error('Payment Intent ID is required for Stripe payments');
      }

      try {
        const paymentIntent = await this.stripeService.retrievePaymentIntent(createOrderDto.paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
          order.status = OrderStatus.PROCESSING; // Or PAID
        } else {
          throw new Error(`Payment not successful: ${paymentIntent.status}`);
        }
      } catch (error) {
        console.error('Stripe verification failed:', error);
        throw new Error('Failed to verify payment');
      }
    }

    const savedOrder = await this.orderRepository.save(order);

    // Create Order Items
    for (const item of cartItems) {
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
      await this.orderItemRepository.save(orderItem);
    }

    // Deduct Stock
    for (const item of cartItems) {
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (product) { // Ensure product exists
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }
        product.stock -= item.quantity;
        await this.productRepository.save(product);
        console.log(`Stock deducted for product ${product.id}: ${item.quantity} units. New stock: ${product.stock}`);
      }
    }

    // Clear cart after order is created
    await this.cartService.clearCart(userId);

    return savedOrder;
  }

  async getOrderByOrderNumber(orderNumber: string) {
    if (!orderNumber) {
      throw new BadRequestException('Order number is required');
    }

    try {
      const order = await this.orderRepository.findOne({
        where: { orderNumber: orderNumber.trim() },
        relations: ['items', 'items.product', 'items.product.brand']
      });

      if (!order) {
        throw new NotFoundException(`Order with identifier ${orderNumber} not found`);
      }

      return order;
    } catch (error) {
      console.error(`[OrdersService] Detailed Tracking Error for ${orderNumber}:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new Error(`Technical tracking failure: ${error.message}`);
    }
  }

  async createPaymentIntent(userId: number) {
    const cartItems = await this.cartService.getCart(userId);

    if (cartItems.length === 0) {
      console.warn(`[OrdersService] CreatePaymentIntent failed: Cart is empty for user ${userId}`);
      throw new BadRequestException('Cart is empty. Please add items before checkout.');
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // console.log('=== CREATE PAYMENT INTENT ===');
    // console.log('User ID:', userId);
    // console.log('Cart Items Count:', cartItems.length);
    // console.log('Calculated Total:', total);

    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(total);
      // console.log('Payment Intent Created:', paymentIntent.id);

      return {
        clientSecret: paymentIntent.client_secret,
        total,
      };
    } catch (error) {
      console.error('[OrdersService] Stripe Payment Intent Creation Failed:', error.message);
      throw error;
    }
  }

  async getUserOrders(userId: number) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllOrders() {
    return this.orderRepository.find({
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(id: number, userId?: number) {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }

    try {
      const order = await this.orderRepository.findOne({
        where,
        relations: {
          items: {
            product: {
              brand: true
            }
          }
        }
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      return order;
    } catch (error) {
      console.error(`[OrdersService] Failed to fetch order by ID ${id}:`, error.message);
      if (error instanceof NotFoundException) throw error;
      throw new Error('Database operation failed while fetching order');
    }
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    const order = await this.getOrderById(id);
    order.status = status;
    return await this.orderRepository.save(order);
  }

  async deleteOrder(id: number) {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Order not found');
    }
  }
}