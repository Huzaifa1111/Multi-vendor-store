'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error('Please fill in all required fields');
      }

      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const result = await register(formData.name, formData.email, formData.password, formData.phone);

      if (result.requiresVerification) {
        setSuccess('Registration successful! Please check your email for verification OTP.');
        localStorage.setItem('pendingVerificationEmail', formData.email);
        setTimeout(() => {
          router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      } else {
        setSuccess('Registration successful! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="text-center mb-8 opacity-0-initial animate-zoom-in delay-300">
            <Link href="/" className="text-5xl font-black tracking-tighter text-white inline-block mb-4 hover:scale-105 transition-transform duration-300">
              <span className="bg-white text-black px-3 py-1 rounded-2xl mr-2">E</span>
              <span>Store</span>
              <span className="text-blue-500 animate-pulse">.</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] opacity-0-initial animate-slide-up delay-500">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
              <p className="text-gray-400 font-medium tracking-wide">Please fill in the details below to get started.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
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

              <div className="space-y-4">
                <div className="group opacity-0-initial animate-slide-left delay-700">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-400 mb-1.5 transition-colors group-focus-within:text-white">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:border-white/30 focus:ring-4 focus:ring-white/5 transition-all duration-300 text-white font-medium placeholder-gray-500"
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>

                <div className="group opacity-0-initial animate-slide-left delay-800">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-400 mb-1.5 transition-colors group-focus-within:text-white">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:border-white/30 focus:ring-4 focus:ring-white/5 transition-all duration-300 text-white font-medium placeholder-gray-500"
                    placeholder="john@example.com"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group opacity-0-initial animate-slide-left delay-900">
                    <label htmlFor="password" className="block text-sm font-bold text-gray-400 mb-1.5 transition-colors group-focus-within:text-white">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:border-white/30 focus:ring-4 focus:ring-white/5 transition-all duration-300 text-white font-medium placeholder-gray-500"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="group opacity-0-initial animate-slide-left delay-1000">
                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-400 mb-1.5 transition-colors group-focus-within:text-white">
                      Confirm
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:border-white/30 focus:ring-4 focus:ring-white/5 transition-all duration-300 text-white font-medium placeholder-gray-500"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="opacity-0-initial animate-slide-up delay-1000 pt-4">
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register Now</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-sm font-medium opacity-0-initial animate-fade-in delay-1000 pt-4">
                <span className="text-gray-500">Already have an account? </span>
                <Link href="/auth/login" className="text-white font-bold border-b-2 border-white hover:bg-white hover:text-black px-1 transition-all duration-300">
                  Login here
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-[10px] text-gray-400 text-center uppercase tracking-widest leading-loose opacity-0-initial animate-fade-in delay-1000">
                By joining, you agree to our <br />
                <Link href="/terms" className="underline hover:text-white transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
