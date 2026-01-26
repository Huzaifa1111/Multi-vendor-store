'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

interface DashboardData {
  userCount: number;
  productCount: number;
  orderCount: number;
  totalRevenue: number;
  activities: any[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Products',
      value: data?.productCount || 0,
      change: '+12%',
      trending: 'up',
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-200'
    },
    {
      title: 'Total Users',
      value: data?.userCount || 0,
      change: '+5%',
      trending: 'up',
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
      shadow: 'shadow-green-200'
    },
    {
      title: 'Total Orders',
      value: data?.orderCount || 0,
      change: '+18%',
      trending: 'up',
      icon: ShoppingCart,
      gradient: 'from-purple-500 to-pink-500',
      shadow: 'shadow-purple-200'
    },
    {
      title: 'Total Revenue',
      value: `$${Number(data?.totalRevenue || 0).toFixed(2)}`,
      change: '+8%',
      trending: 'up',
      icon: DollarSign,
      gradient: 'from-orange-500 to-red-500',
      shadow: 'shadow-orange-200'
    }
  ];

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-50 to-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-80 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 text-lg">Overview of your store performance and system status.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadow}`}>
                  <stat.icon size={24} />
                </div>
                {stat.trending === 'up' && (
                  <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                    <TrendingUp size={12} className="mr-1" />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PlusCircle className="text-purple-600" /> Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/products/create" className="group">
                <div className="p-5 rounded-[1.5rem] bg-blue-50/50 border border-blue-100 hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      <Package size={20} />
                    </span>
                    <ArrowRight size={18} className="text-blue-400 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-white mb-1">Add Product</h3>
                  <p className="text-xs text-gray-500 group-hover:text-white/80 font-medium">Create new inventory item</p>
                </div>
              </Link>

              <Link href="/admin/orders" className="group">
                <div className="p-5 rounded-[1.5rem] bg-green-50/50 border border-green-100 hover:bg-green-600 hover:border-green-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-green-100 text-green-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      <ShoppingCart size={20} />
                    </span>
                    <ArrowRight size={18} className="text-green-400 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-white mb-1">View Orders</h3>
                  <p className="text-xs text-gray-500 group-hover:text-white/80 font-medium">Manage customer purchases</p>
                </div>
              </Link>

              <Link href="/admin/users" className="group">
                <div className="p-5 rounded-[1.5rem] bg-purple-50/50 border border-purple-100 hover:bg-purple-600 hover:border-purple-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      <Users size={20} />
                    </span>
                    <ArrowRight size={18} className="text-purple-400 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-white mb-1">Manage Users</h3>
                  <p className="text-xs text-gray-500 group-hover:text-white/80 font-medium">View and edit accounts</p>
                </div>
              </Link>

              <Link href="/admin/analytics" className="group">
                <div className="p-5 rounded-[1.5rem] bg-orange-50/50 border border-orange-100 hover:bg-orange-600 hover:border-orange-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-orange-100 text-orange-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      <TrendingUp size={20} />
                    </span>
                    <ArrowRight size={18} className="text-orange-400 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-white mb-1">Analytics</h3>
                  <p className="text-xs text-gray-500 group-hover:text-white/80 font-medium">Check store performance</p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-600" /> Recent Activity
            </h2>
            <div className="space-y-4">
              {data?.activities && data.activities.length > 0 ? (
                data.activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-50/80 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'order' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                      {activity.type === 'order' ? <ShoppingCart size={18} /> : <Users size={18} />}
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className="font-bold text-gray-900 text-sm truncate">{activity.title}</p>
                      <p className="text-xs text-gray-500 font-medium mb-1 truncate">{activity.subtitle}</p>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        {new Date(activity.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-50">
                  <p className="text-gray-400 text-sm font-medium">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}