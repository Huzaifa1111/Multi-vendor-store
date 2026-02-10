'use client';

import { useState } from 'react';
import { ordersService } from '@/services/orders.service';
import Link from 'next/link';

const ORDER_STATUS_STEPS = [
    { key: 'pending', label: 'Order Placed', icon: '📝' },
    { key: 'processing', label: 'Processing', icon: '⚙️' },
    { key: 'shipped', label: 'Shipped', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '🎁' }
];

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;

        setIsLoading(true);
        setError('');
        setOrder(null);

        try {
            const data = await ordersService.trackOrder(orderNumber.trim());
            setOrder(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Order not found. Please check the Order ID and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIndex = (status: string) => {
        return ORDER_STATUS_STEPS.findIndex(step => step.key === status.toLowerCase());
    };

    const currentStatusIndex = order ? getStatusIndex(order.status) : -1;

    return (
        <div className="min-h-screen bg-[#0a0a0b] font-jost text-white selection:bg-blue-500/30">
            {/* Premium Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <Link href="/" className="inline-block mb-8 hover:scale-105 transition-transform">
                        <span className="bg-white text-black px-4 py-2 rounded-2xl font-black text-2xl mr-2 shadow-xl shadow-white/10">E</span>
                        <span className="text-3xl font-bold tracking-tighter">Store</span>
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
                        Track Your Order
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                        Enter your order number to see the current status and delivery details of your purchase.
                    </p>
                </div>

                {/* Search Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] shadow-2xl mb-12 animate-slide-up">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Ex: ORD-20240210-A1B2"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 px-8 py-5 rounded-[2rem] outline-none focus:bg-white/10 focus:border-white/20 transition-all text-lg font-medium placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-white text-black px-10 py-5 rounded-[2rem] font-bold text-lg hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-w-[180px]"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Track Now'
                            )}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-3xl text-center mb-12 animate-shake">
                        <p className="font-bold flex items-center justify-center gap-2">
                            <span>⚠️</span> {error}
                        </p>
                    </div>
                )}

                {order && (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Status Tracker */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem]">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Order ID</p>
                                    <h2 className="text-3xl font-black">{order.orderNumber}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Order Date</p>
                                    <p className="text-xl font-bold">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="relative pt-12 pb-6 px-4">
                                <div className="absolute top-[84px] left-12 right-12 h-1 bg-white/10 hidden md:block">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                        style={{ width: `${(Math.max(0, currentStatusIndex) / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative">
                                    {ORDER_STATUS_STEPS.map((step, index) => {
                                        const isCompleted = index <= currentStatusIndex;
                                        const isActive = index === currentStatusIndex;

                                        return (
                                            <div key={step.key} className="flex md:flex-col items-center gap-4 md:gap-4 flex-1 text-center">
                                                <div className={`
                                                    w-16 h-16 rounded-2xl flex items-center justify-center text-2xl z-10 transition-all duration-500
                                                    ${isCompleted ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20 scale-110' : 'bg-white/5 text-gray-600'}
                                                    ${isActive ? 'ring-4 ring-blue-500/20' : ''}
                                                `}>
                                                    {step.icon}
                                                </div>
                                                <div className="text-left md:text-center">
                                                    <p className={`font-bold text-sm uppercase tracking-tighter ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                                                        {step.label}
                                                    </p>
                                                    {isActive && <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Current State</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Items Card */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center text-sm">🛍️</span>
                                    Order Items
                                </h3>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-4 hover:border-white/10 transition-colors">
                                            <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                                                <img
                                                    src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-200 line-clamp-1">{item.product?.name}</h4>
                                                <p className="text-sm text-gray-500 font-medium mb-1">Qty: {item.quantity}</p>
                                                <p className="text-blue-400 font-bold">${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center px-2">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                                    <span className="text-3xl font-black">${order.total}</span>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="space-y-8">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-sm">📍</span>
                                        Shipping Details
                                    </h3>
                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Address</p>
                                        <p className="font-medium text-lg leading-relaxed">{order.shippingAddress}</p>
                                    </div>
                                </div>

                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center text-sm">💳</span>
                                        Payment Method
                                    </h3>
                                    <div className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                                            {order.paymentMethod === 'cod' ? '💵' : '💳'}
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-0.5">Method</p>
                                            <p className="font-bold uppercase">{order.paymentMethod}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Help */}
                <div className="mt-20 text-center animate-fade-in delay-500">
                    <p className="text-gray-500 font-medium">
                        Need help with your order? <Link href="/contact" className="text-white hover:underline underline-offset-4 decoration-white/30 font-bold">Contact our support team</Link>
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-fade-in { animation: fade-in 1s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-shake { animation: shake 0.4s ease-in-out; }
                .delay-500 { animation-delay: 0.5s; }
                
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
}
