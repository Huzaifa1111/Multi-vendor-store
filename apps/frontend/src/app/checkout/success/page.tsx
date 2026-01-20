
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import orderService from '@/services/order.service';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paymentIntentId = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');
    const [status, setStatus] = useState('loading');

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

        // For Stripe, we need to create the order now if we haven't already
        // Ideally we assume the Intent is succeeded.
        // In our backend logic: createOrder checks the intent status.
        const createOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                // We call createOrder with the paymentIntentId
                // The backend will verify it.
                // But wait, the user needs to provide address etc?
                // Ah, in my CheckoutForm for Stripe, I only called confirmPayment.
                // ConfirmPayment doesn't save address to my backend DB unless I passed it or saved it before.
                // FIX: The backend 'createOrder' requires shippingAddress.
                // So I should have passed shippingAddress in metadata or stored it in session?
                // OR: I should create the order with 'PENDING' status BEFORE confirming payment?
                // Let's adjust:
                // 1. CheckoutForm: create PENDING order with Stripe method + Intent ID + Address.
                // 2. Then Confirm Payment.
                // 3. Webhook (or Success Page) updates status to PAID.

                // Simpler for this task:
                // On Success Page, ask user to confirm? No that's bad UX.
                // Re-architect slightly for Stripe:
                // The CheckoutForm should call 'createOrder' API *after* confirmPayment?
                // No, confirmPayment redirects.

                // Correct Flow with Redirect:
                // 1. User clicks Pay.
                // 2. Stripe confirms.
                // 3. Redirects to Success Page.
                // 4. Success Page calls 'finalize-order' API with intent ID?
                // But 'finalize-order' needs to know the cart items (which are still in cart) and address.
                // Address is lost if not saved!

                // Quick Fix for "Address Lost":
                // Save address in localStorage in CheckoutForm before redirect.
                // Retrieve in SuccessPage and send to createOrder.

                const shippingAddress = localStorage.getItem('shippingAddress') || 'Address not provided';

                await orderService.createOrder({
                    paymentMethod: 'stripe',
                    paymentIntentId,
                    shippingAddress
                });

                setStatus('success');
                localStorage.removeItem('shippingAddress'); // Cleanup
            } catch (error) {
                console.error('Order creation failed:', error);
                setStatus('error');
            }
        };

        if (redirectStatus === 'succeeded') {
            createOrder();
        } else {
            setStatus('error');
        }
    }, [paymentIntentId, redirectStatus, router, searchParams]);

    if (status === 'loading') {
        return <div className="p-8 text-center">Processing your order...</div>;
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                    <div className="text-red-600 text-5xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold mb-4">Payment Failed or Order Error</h1>
                    <p className="text-gray-600 mb-8">
                        Something went wrong with your order. Please try again or contact support.
                    </p>
                    <Link href="/checkout" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                        Try Again
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. You will receive an email confirmation shortly.
                </p>
                <Link href="/products" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
