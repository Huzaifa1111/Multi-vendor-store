import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.usersRepository.count();
    
    // For now, return placeholder values
    return {
      totals: {
        users: totalUsers,
        products: 0,
        orders: 0,
      },
      recentOrders: [],
      recentUsers: await this.getRecentUsers(),
    };
  }

  async getRecentUsers() {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
      select: ['id', 'name', 'email', 'role', 'createdAt'],
    });
  }

  async getAllUsers() {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
      select: ['id', 'name', 'email', 'role', 'createdAt', 'phone'],
    });
  }

  async updateUserRole(userId: number, role: UserRole) {
    // Use query builder to avoid TypeORM type issues
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ role })
      .where('id = :id', { id: userId })
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