// /apps/frontend/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  MapPin,
  User,
  LogOut,
  ChevronRight,
  Package,
  DollarSign,
  Clock,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { ordersService } from '@/services/orders.service';

interface Order {
  id: number;
  orderNumber?: string;
  total: number;
  status: string;
  createdAt: string;
  items?: any[];
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [greeting, setGreeting] = useState('Welcome back');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchOrders = async () => {
    try {
      const data = await ordersService.getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const activeOrders = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length;
  const recentOrder = orders.length > 0 ? orders[0] : null; // Assuming API returns sorted, or we sort

  if (authLoading || loadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <motion.div
      className="min-h-screen pb-12 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-black"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2.5rem] bg-black p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-blue-600 to-purple-600 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>
        <div className="relative z-10">
          <p className="text-blue-300 font-medium mb-2 tracking-wide uppercase text-sm">Customer Dashboard</p>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            {greeting}, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {user?.name?.split(' ')[0] || 'User'}!
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Track your orders, manage your profile, and discover new favorites all in one place.
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <Package size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Orders</p>
          <h3 className="text-3xl font-black text-gray-900">{orders.length}</h3>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-green-50 text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Spent</p>
          <h3 className="text-3xl font-black text-gray-900">${totalSpent.toLocaleString()}</h3>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-yellow-50 text-yellow-600">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Active Orders</p>
          <h3 className="text-3xl font-black text-gray-900">{activeOrders}</h3>
        </motion.div>
      </div>

      {/* Quick Actions Grid */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/orders" className="group">
            <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all h-full flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">My Orders</h3>
              <p className="text-xs text-gray-500">Track and buy again</p>
            </div>
          </Link>

          <Link href="/profile" className="group">
            <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all h-full flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Edit Profile</h3>
              <p className="text-xs text-gray-500">Update personal info</p>
            </div>
          </Link>

          <Link href="/addresses" className="group">
            <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:border-green-200 hover:shadow-md transition-all h-full flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Addresses</h3>
              <p className="text-xs text-gray-500">Manage shipping info</p>
            </div>
          </Link>

          <button onClick={() => logout()} className="group w-full">
            <div className="bg-red-50 p-6 rounded-[1.5rem] border border-red-100 shadow-sm hover:bg-red-100 transition-all h-full flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-white text-red-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <LogOut size={24} />
              </div>
              <h3 className="font-bold text-red-700 mb-1">Log Out</h3>
              <p className="text-xs text-red-400">Sign out of account</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Order</h2>
          {orders.length > 0 && (
            <Link href="/dashboard/orders" className="text-sm font-bold text-blue-600 hover:underline flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          )}
        </div>

        {recentOrder ? (
          <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-50 rounded-3xl p-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-300">
              <Package size={32} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-gray-900 text-lg">{recentOrder.orderNumber || recentOrder.id}</h3>
              <p className="text-gray-500 text-sm">
                Placed on {new Date(recentOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-center md:text-right">
              <span className="block text-lg font-black text-gray-900">${Number(recentOrder.total).toFixed(2)}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 capitalize
                    ${recentOrder.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  recentOrder.status === 'cancelled' ? 'bg-red-500/10 text-red-700 border border-red-200' :
                    'bg-yellow-100 text-yellow-700'}`}>
                {recentOrder.status}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-3xl">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your activity here.</p>
            <Link href="/products">
              <button className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                Browse Products
              </button>
            </Link>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}