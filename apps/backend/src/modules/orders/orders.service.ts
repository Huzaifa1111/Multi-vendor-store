import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new Error('Cart is empty');
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Create order
    const order = this.orderRepository.create({
      userId,
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
        // If cart has color/size, we should save it here
        // color: item.color,
        // size: item.size,
      });
      await this.orderItemRepository.save(orderItem);
    }

    // Deduct Stock
    for (const item of cartItems) {
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (product) {
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

  async createPaymentIntent(userId: number) {
    const cartItems = await this.cartService.getCart(userId);

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    console.log('=== CREATE PAYMENT INTENT ===');
    console.log('User ID:', userId);
    console.log('Cart Items Count:', cartItems.length);
    console.log('Calculated Total:', total);

    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(total);
      console.log('Payment Intent Created:', paymentIntent.id);

      return {
        clientSecret: paymentIntent.client_secret,
        total,
      };
    } catch (error) {
      console.error('Stripe Payment Intent Creation Failed:', error);
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

    const order = await this.orderRepository.findOne({
      where,
      relations: ['items', 'items.product', 'items.product.brand']
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
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