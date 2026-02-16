import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { Contact } from '../contact/contact.entity';
import { Review } from '../reviews/review.entity';
import { Category } from '../categories/category.entity';
import { Settings } from './settings.entity';
import { AnalyticsGateway } from './analytics.gateway';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,

    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,

    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,

    private readonly analyticsGateway: AnalyticsGateway,
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

  async getAnalyticsData() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [orders, users, reviews, products] = await Promise.all([
      this.ordersRepository.find({
        where: { createdAt: MoreThan(thirtyDaysAgo) },
        relations: ['items', 'items.product', 'items.product.category']
      }),
      this.usersRepository.count(),
      this.reviewsRepository.count(),
      this.productsRepository.find()
    ]);

    // 1. Sales Trend (Last 30 days)
    const salesTrend: { date: string, revenue: number, count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayOrders = orders.filter(o => o.createdAt.toISOString().split('T')[0] === dateStr);
      const revenue = dayOrders.reduce((sum, o) => sum + Number(o.total), 0);

      salesTrend.push({ date: dateStr, revenue, count: dayOrders.length });
    }

    // 2. Top Selling Products
    const productSales: Record<string, { name: string, sales: number, revenue: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!item.product) return;
        if (!productSales[item.product.id]) {
          productSales[item.product.id] = { name: item.product.name, sales: 0, revenue: 0 };
        }
        productSales[item.product.id].sales += item.quantity;
        productSales[item.product.id].revenue += Number(item.price) * item.quantity;
      });
    });
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // 3. Category Distribution
    const categorySales: Record<string, number> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const catName = item.product?.category?.name || 'Uncategorized';
        categorySales[catName] = (categorySales[catName] || 0) + (Number(item.price) * item.quantity);
      });
    });
    const categoryData = Object.entries(categorySales).map(([name, value]) => ({ name, value }));

    // 4. Order Status distribution
    const statusCounts: Record<string, number> = {};
    orders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    return {
      salesTrend,
      topProducts,
      categoryData,
      statusData,
      summary: {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
        totalUsers: users,
        totalReviews: reviews,
        totalProducts: products.length
      }
    };
  }

  async notifyAnalyticsUpdate() {
    try {
      const data = await this.getAnalyticsData();
      this.analyticsGateway.emitAnalyticsUpdate(data);
    } catch (error) {
      console.error('Failed to notify analytics update:', error);
    }
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

  // Settings Management
  async getSettings() {
    let settings = await this.settingsRepository.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = this.settingsRepository.create({ id: 1 });
      await this.settingsRepository.save(settings);
    }
    return settings;
  }

  async updateSettings(updateData: Partial<Settings>) {
    const settings = await this.getSettings();
    Object.assign(settings, updateData);
    const updated = await this.settingsRepository.save(settings);

    // Broadcast settings update in real-time
    this.analyticsGateway.server.emit('settings-update', updated);

    return updated;
  }
}
