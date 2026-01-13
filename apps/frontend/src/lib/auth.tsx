// apps/frontend/src/lib/auth.tsx - UPDATED
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  isEmailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, phone?: string) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Checking auth...');
      const userData = await authService.getCurrentUser();
      console.log('✅ Auth check successful:', userData);
      setUser(userData);
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 Attempting login for:', email);
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      console.log('✅ Login successful:', response);
      setUser(response.user);
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    console.log('📝 Attempting registration for:', email);
    setIsLoading(true);
    try {
      const response = await authService.register({ name, email, password, phone });
      console.log('✅ Registration response:', response);
      
      // Return the response for handling in the component
      return response;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    console.log('🔢 Verifying OTP for:', email);
    setIsLoading(true);
    try {
      const response = await authService.verifyOtp({ email, otp });
      console.log('✅ OTP verification successful:', response);
      setUser(response.user);
    } catch (error: any) {
      console.error('❌ OTP verification failed:', error);
      throw new Error(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    console.log('🔄 Resending OTP for:', email);
    setIsLoading(true);
    try {
      const response = await authService.resendOtp(email);
      console.log('✅ OTP resent successfully:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Failed to resend OTP:', error);
      throw new Error(error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    verifyOtp,
    resendOtp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 