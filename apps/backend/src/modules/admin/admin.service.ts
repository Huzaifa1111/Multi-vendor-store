import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { Contact } from '../contact/contact.entity';
import { Review } from '../reviews/review.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Product)  // Make sure this exists
    private productsRepository: Repository<Product>,

    @InjectRepository(Order)    // Make sure this exists  
    private ordersRepository: Repository<Order>,
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) { }

  async getDashboardStats() {
    const [userCount, productCount, orderCount, messageCount, reviewCount] = await Promise.all([
      this.usersRepository.count(),
      this.productsRepository.count(),
      this.ordersRepository.count(),
      this.contactsRepository.count(),
      this.reviewsRepository.count(),
    ]);

    const recentOrders = await this.ordersRepository.find({
      take: 5,
      order: { createdAt: 'DESC' },
    });

    // Calculate total revenue
    const orders = await this.ordersRepository.find();
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

    // Get some "Recent Activity" items
    const recentUsers = await this.usersRepository.find({
      take: 5,
      order: { createdAt: 'DESC' },
      select: ['id', 'name', 'createdAt']
    });

    const activities = [
      ...recentOrders.map(o => ({
        type: 'order',
        title: `New order #${o.id} placed`,
        subtitle: `Total: $${o.total}`,
        time: o.createdAt
      })),
      ...recentUsers.map(u => ({
        type: 'user',
        title: `New user registered`,
        subtitle: u.name,
        time: u.createdAt
      }))
    ];

    const recentContacts = await this.contactsRepository.find({
      take: 5,
      order: { createdAt: 'DESC' }
    });

    activities.push(...recentContacts.map(c => ({
      type: 'contact',
      title: `New message from ${c.name}`,
      subtitle: c.subject,
      time: c.createdAt
    })));

    const recentReviews = await this.reviewsRepository.find({
      take: 5,
      order: { createdAt: 'DESC' },
      relations: ['user', 'product']
    });

    activities.push(...recentReviews.map(r => ({
      type: 'review',
      title: `New review on ${r.product?.name}`,
      subtitle: `${r.rating} stars - ${r.user?.name}`,
      time: r.createdAt
    })));

    const sortedActivities = activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

    return {
      userCount,
      productCount,
      orderCount,
      messageCount,
      reviewCount,
      totalRevenue,
      recentOrders,
      activities: sortedActivities
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