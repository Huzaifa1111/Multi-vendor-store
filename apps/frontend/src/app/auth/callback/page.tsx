'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // In our simplified auth setup, we'll need to expose a way to set the token directly
    // or use the authService to verify it and update the context.

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Save token and reload page to trigger AuthProvider's checkAuth
            localStorage.setItem('token', token);
            window.location.href = '/dashboard';
        } else {
            console.error('No token found in callback');
            router.push('/auth/login?error=Authentication failed');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] font-jost">
            <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-white mb-2">Authenticating...</h2>
                <p className="text-gray-400">Please wait while we complete your sign in.</p>
            </div>
        </div>
    );
}
