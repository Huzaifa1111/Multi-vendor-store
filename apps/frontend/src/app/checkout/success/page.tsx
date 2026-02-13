// apps/frontend/src/app/checkout/success/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import orderService from '@/services/order.service';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingBag, Truck, ArrowRight, Package, AlertCircle, RefreshCw } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paymentIntentId = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');
    const paramOrderNumber = searchParams.get('orderNumber');

    const [status, setStatus] = useState('loading');
    const [orderNumber, setOrderNumber] = useState(paramOrderNumber || null);

    useEffect(() => {
        if (!paymentIntentId) {
            if (searchParams.get('payment_intent') === 'cod_success') {
                setStatus('success');
            } else {
                router.push('/');
            }
            return;
        }

        // If COD
        if (paymentIntentId === 'cod_success') {
            setStatus('success');
            return;
        }

        // For Stripe
        const createOrder = async () => {
            try {
                const shippingAddress = localStorage.getItem('shippingAddress') || 'Address not provided';

                const order = await orderService.createOrder({
                    paymentMethod: 'stripe',
                    paymentIntentId,
                    shippingAddress
                });

                setOrderNumber(order.orderNumber);
                setStatus('success');
                localStorage.removeItem('shippingAddress');
            } catch (error) {
                console.error('Order creation failed:', error);
                setStatus('error');
            }
        };

        if (redirectStatus === 'succeeded' && !orderNumber) {
            createOrder();
        } else if (redirectStatus === 'succeeded' && orderNumber) {
            setStatus('success');
        } else if (redirectStatus === 'processing') {
            setStatus('processing');
        } else {
            setStatus('error');
        }
    }, [paymentIntentId, redirectStatus, router, searchParams]);

    if (status === 'loading' || status === 'processing') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-jost">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-emerald-100 border-t-emerald-600 rounded-full animate-spin shadow-sm mb-6" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <RefreshCw className="text-emerald-600 animate-pulse" size={32} />
                    </div>
                </div>
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">
                    {status === 'loading' ? 'Securing Transaction...' : 'Verifying Payment...'}
                </h2>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 font-jost p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-xl text-center border border-red-50"
                >
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <AlertCircle size={40} />
                    </div>
                    <h1 className="text-2xl font-black mb-4 uppercase tracking-tight text-gray-900">Order Discrepancy</h1>
                    <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                        We encountered an issue while finalizing your order. Don't worry, your payment is secure.
                    </p>
                    <Link href="/checkout" className="block w-full bg-black text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-gray-800 transition-all hover:scale-[1.02]">
                        Try Again
                    </Link>
                    <button onClick={() => window.location.reload()} className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
                        Refresh Page
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-jost p-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10" />

            <div className="max-w-xl w-full text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10 border border-emerald-50"
                >
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 size={32} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black mb-3 text-gray-900 tracking-tighter">
                        Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-black">Victory!</span>
                    </h1>
                    <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                        Your selection has been secured. We are preparing it with the utmost care for its journey to you.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] mb-10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <Package size={120} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-3 ml-[0.4em]">Reference Identifier</span>
                            <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 flex items-center gap-4 group/ref">
                                <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none select-all italic">
                                    {orderNumber || 'Pending...'}
                                </span>
                            </div>
                            <p className="mt-4 text-[10px] font-medium text-gray-400">Share this ID for tracking and support enquiries.</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    <Link href="/products" className="group flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-emerald-900 transition-all hover:scale-[1.02] shadow-lg shadow-black/10">
                        <ShoppingBag size={14} />
                        <span>Continue Selection</span>
                    </Link>

                    {orderNumber ? (
                        <Link href="/track-order" className="group flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:border-black transition-all hover:scale-[1.02]">
                            <Truck size={14} />
                            <span>Track Logistics</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <div className="flex items-center justify-center gap-3 bg-gray-50 border-2 border-gray-100 text-gray-400 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] cursor-not-allowed">
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Awaiting ID</span>
                        </div>
                    )}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]"
                >
                    Luxury Refined • Emerald Collection
                </motion.p>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 font-jost">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
