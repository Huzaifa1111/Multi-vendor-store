'use client';

import { useState } from 'react';
import { Package, Search, Truck, CheckCircle, Clock, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setOrder(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/track?orderId=${orderId}&email=${email}`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Order not found');
            }

            const data = await response.json();
            setOrder(data);
        } catch (err: any) {
            console.error('Tracking error:', err);
            setError(err.message || 'Failed to track order. Please check your details and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStep = (status: string) => {
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
        return steps.indexOf(status.toLowerCase());
    };

    const steps = [
        { id: 'pending', label: 'Order Placed', icon: Clock, description: 'We have received your order.' },
        { id: 'processing', label: 'Processing', icon: Package, description: 'Your order is being prepared.' },
        { id: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on its way.' },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Order has been delivered.' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 md:py-20 font-jost">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="max-w-3xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold uppercase tracking-widest"
                        >
                            <Truck size={16} className="mr-2" /> Track Your Package
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Order Tracking</h1>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">
                            Enter your order details below to get real-time updates on your shipment status.
                        </p>
                    </div>

                    {/* Tracking Form */}
                    <Card className="rounded-[2.5rem] shadow-xl border-none overflow-hidden">
                        <CardContent className="p-8 md:p-12">
                            <form onSubmit={handleTrack} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Order ID</label>
                                        <div className="relative">
                                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                placeholder="e.g. 123456"
                                                value={orderId}
                                                onChange={(e) => setOrderId(e.target.value)}
                                                required
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all font-medium text-gray-900"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Billing Email</label>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="email"
                                                placeholder="e.g. you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all font-medium text-gray-900"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-5 rounded-2xl font-black text-lg bg-black hover:bg-gray-800 text-white shadow-2xl shadow-gray-200 transition-all active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            Track Order <ArrowRight className="ml-2" size={20} />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-center font-bold flex items-center justify-center gap-2"
                                >
                                    <AlertTriangle size={20} /> {error}
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tracking Results */}
                    <AnimatePresence>
                        {order && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-8 pb-20"
                            >
                                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-gray-50 pb-8">
                                        <div>
                                            <p className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">Current Status</p>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{order.status}</h2>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-400 mb-1">Order Date</p>
                                            <p className="text-lg font-black text-gray-900">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                        </div>
                                    </div>

                                    {/* Stepper */}
                                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                                        {steps.map((step, idx) => {
                                            const currentStepIdx = getStatusStep(order.status);
                                            const isCompleted = idx <= currentStepIdx;
                                            const isActive = idx === currentStepIdx;

                                            return (
                                                <div key={step.id} className="relative space-y-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-lg ${isCompleted ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-gray-50 text-gray-300'}`}>
                                                            <step.icon size={28} strokeWidth={isCompleted ? 2.5 : 1.5} />
                                                        </div>
                                                        <div className="mt-4 text-center">
                                                            <p className={`font-black text-sm uppercase tracking-wider mb-1 ${isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</p>
                                                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.description}</p>
                                                        </div>
                                                    </div>
                                                    {idx < steps.length - 1 && (
                                                        <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-100 -z-10">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: isCompleted ? '100%' : '0%' }}
                                                                className="h-full bg-blue-600 shadow-sm"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-16 bg-gray-50 rounded-[2rem] p-8 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Shipping Address</h4>
                                            <p className="text-gray-900 font-bold leading-relaxed">
                                                {order.shippingAddress || 'Not available'}
                                            </p>
                                        </div>
                                        <div className="md:text-right">
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Payment Method</h4>
                                            <p className="text-gray-900 font-bold uppercase">
                                                {order.paymentMethod || 'Credit Card'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
