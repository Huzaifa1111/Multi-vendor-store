
'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import orderService from '@/services/order.service';

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
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
                {error ? (
                    <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center">
                        <p className="text-red-700 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm clientSecret={clientSecret} />
                    </Elements>
                ) : (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <span className="ml-3 text-gray-600">Initializing Checkout...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
