'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Total Products',
      value: '1,234',
      change: '+12%',
      trending: 'up',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Users',
      value: '5,678',
      change: '+8%',
      trending: 'up',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: '890',
      change: '-3%',
      trending: 'down',
      icon: ShoppingCart,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Revenue',
      value: '$45,670',
      change: '+23%',
      trending: 'up',
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to your administration panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`${stat.color} p-2 rounded-md`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-2">
                {stat.trending === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${stat.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* FIXED: Add New Product Button */}
            <Link href="/admin/products/create">
              <button className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium transition-colors flex items-center justify-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add New Product
              </button>
            </Link>
            
            <Link href="/admin/orders">
              <button className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium transition-colors">
                View Orders
              </button>
            </Link>
            
            <Link href="/admin/users">
              <button className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium transition-colors">
                Manage Users
              </button>
            </Link>
            
            <Link href="/admin/analytics">
              <button className="w-full p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 font-medium transition-colors">
                Analytics
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">New order placed</p>
                  <p className="text-sm text-gray-500">Order #ORD{item}00{item}</p>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}