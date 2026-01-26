'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Calendar,
    DollarSign,
    ChevronRight,
    ArrowLeft,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    ShoppingBag,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { ordersService } from '@/services/orders.service';

interface Order {
    id: number;
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

export default function MyOrdersPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
        }

        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, authLoading, router]);

    const fetchOrders = async () => {
        try {
            const data = await ordersService.getUserOrders();
            // Sort by newest first if API doesn't
            const sorted = Array.isArray(data) ? data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
            setOrders(sorted);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const getStatusConfig = (status: string) => {
        const s = status.toLowerCase();
        switch (s) {
            case 'delivered':
            case 'completed':
                return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: 'Delivered' };
            case 'processing':
            case 'shipped':
                return { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100', text: 'In Transit' };
            case 'cancelled':
                return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', text: 'Cancelled' };
            default:
                return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Processing' };
        }
    };

    if (authLoading || loadingOrders) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <motion.div
            className="min-h-screen pb-12 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-2 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Orders</h1>
                    <p className="text-gray-500 mt-1">Track and manage your purchase history.</p>
                </div>
                <div className="px-5 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-sm font-bold text-gray-700">
                    {orders.length} Orders Placed
                </div>
            </motion.div>

            {/* Orders List */}
            <motion.div variants={itemVariants} className="space-y-4">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm text-center px-4">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 max-w-sm mb-8">It looks like you haven't placed any orders yet. Start exploring our collection today!</p>
                        <Link href="/products">
                            <button className="px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
                                Start Shopping
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence>
                            {orders.map((order, index) => {
                                const statusConfig = getStatusConfig(order.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <motion.div
                                        key={order.id}
                                        variants={itemVariants}
                                        className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
                                    >
                                        <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                                            {/* Order Info */}
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-gray-400">
                                                    <Package size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">Order #{order.id}</h3>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 font-medium">
                                                        <span className="flex items-center">
                                                            <Calendar size={14} className="mr-1.5" />
                                                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Clock size={14} className="mr-1.5" />
                                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status & Price */}
                                            <div className="flex items-center justify-between lg:justify-end gap-6 flex-1 border-t lg:border-t-0 border-gray-50 pt-4 lg:pt-0">
                                                <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold ${statusConfig.color} ${statusConfig.bg}`}>
                                                    <StatusIcon size={16} className="mr-2" />
                                                    {statusConfig.text || order.status}
                                                </span>

                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total</p>
                                                    <p className="text-2xl font-black text-gray-900">
                                                        ${Number(order.total).toFixed(2)}
                                                    </p>
                                                </div>

                                                <div className="hidden sm:block pl-4 border-l border-gray-100">
                                                    <button className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
