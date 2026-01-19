import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    
    @InjectRepository(Product)  // Make sure this exists
    private productsRepository: Repository<Product>,
    
    @InjectRepository(Order)    // Make sure this exists  
    private ordersRepository: Repository<Order>,
  ) {}

  async getDashboardStats() {
    const [userCount, productCount, orderCount] = await Promise.all([
      this.usersRepository.count(),
      this.productsRepository.count(),
      this.ordersRepository.count(),
    ]);

    const recentOrders = await this.ordersRepository.find({
      take: 5,
      order: { createdAt: 'DESC' },
    });

    return {
      userCount,
      productCount,
      orderCount,
      recentOrders,
    };
  }

  async getAllUsers() {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getAllOrders() {
    return this.ordersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getAllProducts() {
    return this.productsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}