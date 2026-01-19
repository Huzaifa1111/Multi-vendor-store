'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import orderService from '@/services/order.service';

export default function CheckoutForm() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'credit_card',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = 'Shipping address is required';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Create order
      await orderService.createOrder({
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
      });

      // Clear cart
      await clearCart();

      // Redirect to success page
      router.push('/order-success');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>

      {/* Shipping Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shipping Address *
        </label>
        <textarea
          name="shippingAddress"
          value={formData.shippingAddress}
          onChange={handleChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.shippingAddress ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your complete shipping address"
        />
        {errors.shippingAddress && (
          <p className="mt-1 text-sm text-red-600">{errors.shippingAddress}</p>
        )}
      </div>

      {/* Payment Method */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method *
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={formData.paymentMethod === 'credit_card'}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span>Credit Card</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={formData.paymentMethod === 'paypal'}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span>PayPal</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="cash_on_delivery"
              checked={formData.paymentMethod === 'cash_on_delivery'}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span>Cash on Delivery</span>
          </label>
        </div>
        {errors.paymentMethod && (
          <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
        )}
      </div>

      {/* Order Summary */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items ({items.length})</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${(total * 0.1).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${(total * 1.1).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>

      <p className="mt-4 text-sm text-gray-500 text-center">
        By placing your order, you agree to our Terms of Service
      </p>
    </form>
  );
}