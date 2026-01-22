'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login, user } = useAuth();
    const searchParams = useSearchParams();

    // Check for verification success message
    useEffect(() => {
        const verified = searchParams.get('verified');
        if (verified === 'true') {
            setSuccess('Email verified successfully! You can now log in.');
        }

        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            if (!email || !password) {
                throw new Error('Please enter both email and password');
            }

            if (!/\S+@\S+\.\S+/.test(email)) {
                throw new Error('Please enter a valid email address');
            }

            await login(email, password);
        } catch (err: any) {
            if (err.message.includes('verify your email')) {
                setError(err.message + ' Please check your email for verification OTP.');
            } else {
                setError(err.message || 'Login failed. Please check your credentials.');
            }
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        }
    }, [user, router]);

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
                            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
                            <p className="text-gray-400 font-medium tracking-wide">Please enter your details to sign in.</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Error/Success Messages */}
                            <div>
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl text-sm font-medium animate-fade-in">
                                        <div className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                            <span>{error}</span>
                                        </div>
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-2xl text-sm font-medium animate-fade-in">
                                        <div className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                                            <span>{success}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-5">
                                <div className="group opacity-0-initial animate-slide-left delay-700">
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-400 mb-2 transition-colors group-focus-within:text-white">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:border-white/30 focus:ring-4 focus:ring-white/5 transition-all duration-300 text-white font-medium placeholder-gray-500"
                                        placeholder="name@company.com"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="group relative opacity-0-initial animate-slide-left delay-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <label htmlFor="password" className="text-sm font-bold text-gray-400 group-focus-within:text-white transition-colors">
                                            Password
                                        </label>
                                        <Link href="/auth/verify-email" className="text-xs font-bold text-blue-400 hover:text-blue-300 underline decoration-1 underline-offset-4">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:border-white/30 focus:ring-4 focus:ring-white/5 transition-all duration-300 text-white font-medium placeholder-gray-500"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="opacity-0-initial animate-slide-up delay-1000 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white text-black py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_40px_rgba(255,255,255,0.05)] group"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-6 w-6 text-black" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="relative opacity-0-initial animate-fade-in delay-1000 py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                                    <span className="bg-[#141416]/50 backdrop-blur-md px-4 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="opacity-0-initial animate-slide-up delay-1000">
                                <button
                                    type="button"
                                    onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/google`}
                                    className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 group"
                                >
                                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                        />
                                    </svg>
                                    <span>Google Account</span>
                                </button>
                            </div>

                            {/* Footer Links */}
                            <div className="text-center text-sm font-medium opacity-0-initial animate-fade-in delay-1000 pt-4">
                                <span className="text-gray-500">Don't have an account? </span>
                                <Link href="/auth/register" className="text-white font-bold border-b-2 border-white hover:bg-white hover:text-black px-1 transition-all duration-300">
                                    Create one for free
                                </Link>
                            </div>

                            {/* Demo Access */}
                            <div className="mt-8 p-5 bg-white/5 rounded-[2rem] border border-white/10 opacity-0-initial animate-zoom-in delay-1000">
                                <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-3 text-center">Demo Access</p>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 font-bold mb-0.5">Admin Email</span>
                                        <span className="text-white font-mono font-bold">admin@store.com</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-gray-500 font-bold mb-0.5">Password</span>
                                        <span className="text-white font-mono font-bold">Admin@123</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
