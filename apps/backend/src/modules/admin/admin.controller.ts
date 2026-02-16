import { Controller, Get, UseGuards, Patch, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('orders')
  async getAllOrders() {
    return this.adminService.getAllOrders();
  }

  @Get('products')
  async getAllProducts() {
    return this.adminService.getAllProducts();
  }

  @Get('analytics')
  async getAnalyticsData() {
    return this.adminService.getAnalyticsData();
  }

  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings')
  async updateSettings(@Body() updateData: any) {
    return this.adminService.updateSettings(updateData);
  }
}