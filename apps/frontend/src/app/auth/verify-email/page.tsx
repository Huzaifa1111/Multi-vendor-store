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
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.role === 'admin') {
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
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] font-jost relative overflow-hidden">
                {/* Premium Animated Background */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '2s' }}></div>
                <div className="max-w-md w-full text-center relative z-10 transition-opacity duration-500">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4 text-gray-400 font-medium tracking-wide">Securing your session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] font-jost relative overflow-hidden">
            {/* Premium Animated Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px] animate-float pointer-events-none"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>

            <div className="w-full flex items-center justify-center p-6 md:p-12 relative z-10">
                <div className="max-w-md w-full opacity-0-initial animate-slide-up">

                    {/* Logo Section */}
                    <div className="text-center mb-10 opacity-0-initial animate-zoom-in delay-300">
                        <Link href="/" className="text-5xl font-black tracking-tighter text-white inline-block mb-4 hover:scale-105 transition-transform duration-300">
                            <span className="bg-white text-black px-3 py-1 rounded-2xl mr-2">E</span>
                            <span>Store</span>
                            <span className="text-blue-500 animate-pulse">.</span>
                        </Link>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] opacity-0-initial animate-slide-up delay-500">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight opacity-0-initial animate-slide-up delay-700">Check your email</h2>
                            <p className="text-gray-400 font-medium tracking-wide opacity-0-initial animate-slide-up delay-800">
                                We've sent a 6-digit code to <span className="text-white font-bold border-b border-white/20">{email}</span>
                            </p>
                        </div>

                        <div className="opacity-0-initial animate-slide-up delay-1000">
                            <VerifyOtpForm
                                email={email}
                                onVerify={handleVerify}
                                onResend={handleResend}
                            />
                        </div>

                        <div className="mt-10 text-center text-sm font-medium opacity-0-initial animate-fade-in delay-1000">
                            <p className="text-gray-500">
                                Entered the wrong email?{' '}
                                <Link
                                    href="/auth/register"
                                    className="text-white font-bold border-b-2 border-white hover:bg-white hover:text-black px-1 transition-all duration-300"
                                    onClick={() => localStorage.removeItem('pendingVerificationEmail')}
                                >
                                    Start over here
                                </Link>
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/10 flex justify-center">
                                <Link href="/auth/login" className="text-gray-500 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px] group flex items-center">
                                    <span className="mr-2 group-hover:-translate-x-2 transition-transform inline-block duration-300">←</span> Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
