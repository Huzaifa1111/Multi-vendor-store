'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    Package,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    DollarSign,
    MapPin,
    CreditCard,
    ShoppingBag,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ordersService } from '@/services/orders.service';

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        images: string[];
        price: number;
    };
}

interface Order {
    id: number;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
    paymentMethod?: string;
    shippingAddress?: string;
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

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
        }

        if (isAuthenticated && id) {
            fetchOrder();
        }
    }, [isAuthenticated, authLoading, id, router]);

    const fetchOrder = async () => {
        try {
            const data = await ordersService.getOrderById(Number(id));
            setOrder(data);
        } catch (error) {
            console.error('Failed to fetch order details', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        const s = status?.toLowerCase() || '';
        switch (s) {
            case 'delivered':
            case 'completed':
                return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: 'Delivered' };
            case 'shipped':
                return { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100', text: 'Shipped' };
            case 'cancelled':
                return { icon: XCircle, color: 'text-red-700', bg: 'bg-red-500/10', text: 'Cancelled' };
            case 'processing':
                return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Processing' };
            default:
                return { icon: Package, color: 'text-gray-600', bg: 'bg-gray-100', text: status };
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
                    <Link href="/dashboard/orders">
                        <button className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                            Back to My Orders
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;

    return (
        <motion.div
            className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard/orders" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-2 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back to My Orders
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">{order.orderNumber || order.id}</h1>
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${statusConfig.color} ${statusConfig.bg}`}>
                            <StatusIcon size={14} className="mr-1.5" />
                            {statusConfig.text}
                        </span>
                    </div>
                    <p className="text-gray-500 mt-2 font-medium flex items-center">
                        <Calendar size={16} className="mr-2" />
                        Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50">
                            <h2 className="text-xl font-black text-gray-900 flex items-center">
                                <ShoppingBag size={20} className="mr-3 text-gray-400" />
                                Order Items
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-8 flex gap-6 group hover:bg-gray-50/50 transition-colors">
                                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                        <Image
                                            src={item.product?.images?.[0] || '/placeholder-product.png'}
                                            alt={item.product?.name || 'Product'}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                {item.product?.name}
                                            </h3>
                                            <p className="text-gray-500 font-medium">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xl font-black text-gray-900">${Number(item.price).toFixed(2)}</p>
                                            <p className="text-sm font-bold text-gray-400">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Order Summary & Info */}
                <div className="space-y-6">
                    {/* Summary Card */}
                    <motion.div variants={itemVariants} className="bg-black text-white rounded-[2.5rem] p-8 shadow-xl">
                        <h2 className="text-xl font-black mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-400 font-bold uppercase tracking-wider text-xs">
                                <span>Subtotal</span>
                                <span>${Number(order.total).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 font-bold uppercase tracking-wider text-xs">
                                <span>Shipping</span>
                                <span className="text-green-400">Free</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-3xl font-black">${Number(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Shipping & Payment Info */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-6">
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                <CreditCard size={14} className="mr-2" />
                                Payment Method
                            </h3>
                            <p className="text-gray-900 font-bold">{order.paymentMethod || 'Credit Card'}</p>
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                <MapPin size={14} className="mr-2" />
                                Shipping Address
                            </h3>
                            <p className="text-gray-900 font-bold leading-relaxed">
                                {order.shippingAddress || 'No address details provided.'}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
