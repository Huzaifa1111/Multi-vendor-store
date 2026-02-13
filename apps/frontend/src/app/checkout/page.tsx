// apps/frontend/src/app/checkout/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import orderService from '@/services/order.service';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock } from 'lucide-react';

export default function CheckoutPage() {
    const [clientSecret, setClientSecret] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        const fetchClientSecret = async () => {
            try {
                setLoading(true);
                const { clientSecret } = await orderService.createPaymentIntent();
                setClientSecret(clientSecret);
                setError(null);
            } catch (err: any) {
                console.error('Failed to init payment:', err);
                setError(err.message || 'Failed to initialize checkout. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchClientSecret();
    }, []);

    const appearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#059669', // Emerald 600
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#dc2626',
            fontFamily: 'Jost, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '12px',
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="min-h-screen bg-gray-50 font-jost relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-2 mb-4 text-emerald-600">
                        <Lock size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Checkout</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Finalize Your <span className="text-emerald-600">Order</span>
                    </h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Complete your purchase securely. You're just a few steps away from owning something extraordinary.
                    </p>
                </motion.div>

                {error ? (
                    <div className="bg-red-50 border border-red-200 p-8 rounded-[2rem] text-center max-w-xl mx-auto">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Checkout Initialization Failed</h3>
                        <p className="text-red-600 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-black text-white rounded-xl font-bold uppercase tracking-wider hover:bg-gray-800 transition-all hover:scale-105"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm clientSecret={clientSecret} />
                    </Elements>
                ) : (
                    <div className="flex flex-col justify-center items-center h-64">
                        <div className="w-16 h-16 bg-white border-2 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4 shadow-sm"></div>
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Securing Connection...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
