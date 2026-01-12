'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RegisterForm from '@/components/forms/RegisterForm';
import { register } from '@/services/auth.service';
import { useAuth } from '@/lib/auth'; // Use context instead of direct service

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth(); // Get register from context
  const [error, setError] = useState('');

  const handleRegister = async (name: string, email: string, password: string, phone?: string) => {
    try {
      setError('');
      await register(name, email, password, phone); // This now updates context
      router.push('/dashboard'); // Redirect to dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to existing account
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <RegisterForm onSubmit={handleRegister} />
      </div>
    </div>
  );
}