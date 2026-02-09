
'use client';

import { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { addressesService, Address as SavedAddress } from '@/services/addresses.service';
import { Home, Briefcase, MapPin, Loader2, Check } from 'lucide-react';
import { useEffect } from 'react';

export default function CheckoutForm({ clientSecret }: { clientSecret: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | 'new'>('new');
    const [isFetchingAddresses, setIsFetchingAddresses] = useState(false);

    useEffect(() => {
        const fetchAddresses = async () => {
            setIsFetchingAddresses(true);
            try {
                const data = await addressesService.getAll();
                setSavedAddresses(data);
                const defaultAddr = data.find(a => a.isDefault);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.id);
                    setAddress(defaultAddr.street);
                    setCity(defaultAddr.city);
                }
            } catch (error) {
                console.error('Failed to fetch addresses:', error);
            } finally {
                setIsFetchingAddresses(false);
            }
        };
        fetchAddresses();
    }, []);

    const handleAddressSelect = (id: number | 'new') => {
        setSelectedAddressId(id);
        if (id === 'new') {
            setAddress('');
            setCity('');
        } else {
            const addr = savedAddresses.find(a => a.id === id);
            if (addr) {
                setAddress(addr.street);
                setCity(addr.city);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        const shippingAddress = `${address}, ${city}`;
        localStorage.setItem('shippingAddress', shippingAddress);

        if (paymentMethod === 'stripe') {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/success`,
                    // You can pass extra data here but usually it's better to save order after webhook
                    // However for this simple app, we might rely on the return_url query params
                    // or create order *before* confirming? 
                    // Best practice for simple app: confirmPayment, then backend webhook creates order.
                    // OR: create order as PENDING, then pay.
                    // Current flow: we have an intent. 
                },
            });

            if (error) {
                setErrorMessage(error.message || 'An error occurred');
                setIsLoading(false);
            }
            // If success, it redirects.
        } else {
            // COD Flow
            try {
                const token = localStorage.getItem('token');
                await axios.post(
                    'http://localhost:3001/orders',
                    {
                        shippingAddress,
                        paymentMethod: 'cod',
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                router.push('/checkout/success?payment_intent=cod_success');
            } catch (err: any) {
                setErrorMessage(err.response?.data?.message || 'Failed to place order');
                setIsLoading(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <MapPin className="text-indigo-600" size={24} />
                    Shipping Information
                </h2>

                {isFetchingAddresses ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="animate-spin text-indigo-600" />
                    </div>
                ) : savedAddresses.length > 0 ? (
                    <div className="space-y-4 mb-8">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Select a saved address</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {savedAddresses.map((addr) => (
                                <button
                                    key={addr.id}
                                    type="button"
                                    onClick={() => handleAddressSelect(addr.id)}
                                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedAddressId === addr.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    {selectedAddressId === addr.id && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                                            <Check size={12} />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 mb-1">
                                        {addr.type === 'home' ? <Home size={16} className="text-gray-400" /> : <Briefcase size={16} className="text-gray-400" />}
                                        <span className="text-xs font-black uppercase text-gray-500">{addr.type}</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 truncate">{addr.street}</p>
                                    <p className="text-xs text-gray-500">{addr.city}, {addr.zipCode}</p>
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddressSelect('new')}
                                className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all ${selectedAddressId === 'new' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                            >
                                <MapPin size={20} />
                                <span className="text-xs font-bold">New Address</span>
                            </button>
                        </div>
                    </div>
                ) : null}

                <div className={`grid grid-cols-1 gap-4 transition-all ${savedAddresses.length > 0 && selectedAddressId !== 'new' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address line</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border font-medium"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Street address, apartment, suite, etc."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border font-medium"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            id="stripe"
                            name="paymentMethod"
                            type="radio"
                            checked={paymentMethod === 'stripe'}
                            onChange={() => setPaymentMethod('stripe')}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label htmlFor="stripe" className="ml-3 block text-sm font-medium text-gray-700">
                            Credit Card (Stripe)
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="cod"
                            name="paymentMethod"
                            type="radio"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                            Cash on Delivery (COD)
                        </label>
                    </div>
                </div>

                {paymentMethod === 'stripe' && (
                    <div className="mt-4">
                        <PaymentElement />
                    </div>
                )}
            </div>

            {errorMessage && (
                <div className="bg-red-50 p-4 rounded-md">
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || (!stripe && paymentMethod === 'stripe')}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
                {isLoading ? 'Processing...' : `Pay ${paymentMethod === 'cod' ? 'via COD' : ''}`}
            </button>
        </form>
    );
}
