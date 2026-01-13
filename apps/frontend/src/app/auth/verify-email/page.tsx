// apps/frontend/src/app/auth/verify-email/page.tsx - NEW FILE
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import VerifyOtpForm from '@/components/forms/VerifyOtpForm';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp, user } = useAuth();

  useEffect(() => {
    // Get email from query params or localStorage
    const emailFromParams = searchParams.get('email');
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    
    if (emailFromParams) {
      setEmail(emailFromParams);
      localStorage.setItem('pendingVerificationEmail', emailFromParams);
      setIsInitializing(false);
    } else if (storedEmail) {
      setEmail(storedEmail);
      setIsInitializing(false);
    } else {
      // No email found, redirect to register
      router.push('/auth/register');
    }
  }, [searchParams, router]);

  useEffect(() => {
    // If user is already verified, redirect
    if (user?.isEmailVerified) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  const handleVerify = async (email: string, otp: string) => {
    await verifyOtp(email, otp);
    
    // Clear pending email from localStorage
    localStorage.removeItem('pendingVerificationEmail');
    
    // Redirect based on role
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const handleResend = async (email: string) => {
    await resendOtp(email);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              return to login
            </Link>
          </p>
        </div>
        
        <VerifyOtpForm 
          email={email}
          onVerify={handleVerify}
          onResend={handleResend}
        />
        
        <div className="text-center text-sm text-gray-500">
          <p>
            Having trouble?{' '}
            <Link 
              href="/auth/register" 
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => localStorage.removeItem('pendingVerificationEmail')}
            >
              Register with a different email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}