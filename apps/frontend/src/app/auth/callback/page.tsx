'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { authService } from '@/services/auth.service';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            const handleAuth = async () => {
                try {
                    // Save token first
                    localStorage.setItem('token', token);

                    // Fetch full user profile to get email/name/picture
                    const userData = await authService.getCurrentUser();

                    // Save user info and remembered email for pre-fill
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('rememberedEmail', userData.email);

                    // Use Credential Management API to prompt browser to "save" the login
                    if ('credentials' in navigator && (window as any).FederatedCredential) {
                        try {
                            const cred = new (window as any).FederatedCredential({
                                id: userData.email,
                                name: userData.name,
                                provider: 'https://accounts.google.com',
                                iconURL: userData.picture
                            });
                            await navigator.credentials.store(cred);
                        } catch (credError) {
                            console.warn('Credential storage failed:', credError);
                        }
                    }

                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                } catch (error) {
                    console.error('Failed to complete Google login:', error);
                    router.push('/auth/login?error=Failed to fetch user profile');
                }
            };

            handleAuth();
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
