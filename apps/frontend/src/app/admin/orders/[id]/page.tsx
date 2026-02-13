// apps/frontend/src/app/admin/orders/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ordersService } from '@/services/orders.service';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Package,
    Truck,
    CreditCard,
    User,
    Calendar,
    MapPin,
    CheckCircle,
    Clock,
    AlertTriangle,
    Loader2,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { resolveProductImage } from '@/lib/image';

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
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await ordersService.getOrderById(Number(params.id));
                setOrder(data);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [params.id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'processing': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                <Package size={48} className="mx-auto text-gray-200 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
                <Link href="/admin/orders" className="text-blue-600 font-bold mt-4 inline-block hover:underline">
                    Back to orders
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            className="space-y-8 pb-12"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none"></div>

                <div className="relative z-10 flex items-center gap-4">
                    <Link href="/admin/orders" className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-black hover:shadow-md transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{order.orderNumber || order.id}</h1>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium flex items-center gap-2">
                            <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <button
                        className="px-6 py-3 rounded-xl bg-black text-white font-bold shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all flex items-center gap-2"
                        onClick={() => window.print()}
                    >
                        Print Invoice
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Items & Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Items */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Package className="text-blue-600" /> Order Items
                        </h2>

                        <div className="space-y-6">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="flex gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                        <img
                                            src={resolveProductImage(item.product?.images)}
                                            alt={item.product?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <Link href={`/admin/products/edit/${item.productId}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors text-lg line-clamp-1 flex items-center gap-2">
                                                {item.product?.name} <ExternalLink size={14} />
                                            </Link>
                                            <span className="font-black text-xl text-gray-900">${item.price}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mb-3">
                                            <div className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">
                                                Qty: {item.quantity}
                                            </div>
                                            {item.color && (
                                                <div className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full border border-gray-200" style={{ backgroundColor: item.color }}></div>
                                                    Color: {item.color}
                                                </div>
                                            )}
                                            {item.size && (
                                                <div className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">
                                                    Size: {item.size}
                                                </div>
                                            )}
                                            {item.product?.brand && (
                                                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                                                    Brand: {item.product.brand.name}
                                                </div>
                                            )}
                                        </div>

                                        {item.product?.longDescription && (
                                            <div className="text-sm text-gray-500 line-clamp-2 italic border-l-2 border-gray-100 pl-3">
                                                {item.product.longDescription}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-end gap-2 text-right">
                            <div className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Total Amount</div>
                            <div className="text-4xl font-black text-gray-900">${order.total}</div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Customer & Info */}
                <div className="space-y-8">
                    {/* Customer Card */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User className="text-purple-600" /> Customer Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 font-black text-lg">
                                    {order.userId}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">User ID: #{order.userId}</div>
                                    <div className="text-xs text-gray-500">Customer since {new Date().getFullYear()}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Shipping Info */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Truck className="text-orange-600" /> Shipping Details
                        </h2>
                        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <MapPin className="text-gray-400 mt-1" size={20} />
                            <div className="text-sm font-medium text-gray-700 leading-relaxed">
                                {order.shippingAddress || 'No shipping address provided'}
                            </div>
                        </div>
                    </motion.div>

                    {/* Payment Info */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <CreditCard className="text-green-600" /> Payment Information
                        </h2>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-gray-200">
                                    <span className="text-xs font-black uppercase">{order.paymentMethod}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">{order.paymentMethod}</span>
                            </div>
                            <div className="text-green-600 font-bold flex items-center gap-1 text-sm">
                                <CheckCircle size={16} /> Paid
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
