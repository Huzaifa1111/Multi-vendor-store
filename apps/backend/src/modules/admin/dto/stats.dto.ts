export class DashboardStatsDto {
  totals: {
    users: number;
    products: number;
    orders: number;
  };
  recentOrders: any[];
  recentUsers: any[];
}

export class UpdateRoleDto {
  role: string;
}