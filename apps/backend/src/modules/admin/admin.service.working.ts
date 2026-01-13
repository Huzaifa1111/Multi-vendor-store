import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.usersRepository.count();
    
    // Placeholder values for products and orders
    const totalProducts = 0;
    const totalOrders = 0;

    const recentUsers = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
      select: ['id', 'name', 'email', 'role', 'createdAt'],
    });

    return {
      totals: {
        users: totalUsers,
        products: totalProducts,
        orders: totalOrders,
      },
      recentOrders: [],
      recentUsers,
    };
  }

  async getAllUsers() {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
      select: ['id', 'name', 'email', 'role', 'createdAt', 'phone'],
    });
  }

  async updateUserRole(userId: number, role: string) {
    // Using query builder to avoid type issues
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ role: role as any })
      .where("id = :id", { id: userId })
      .execute();

    return this.usersRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'name', 'email', 'role', 'createdAt']
    });
  }

  async deleteUser(userId: number) {
    return this.usersRepository.delete(userId);
  }
}