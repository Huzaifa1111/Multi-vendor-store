'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, logout: authLogout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    authLogout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header - REMOVED, using main Header instead */}

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 pr-8">
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg"
              >
                <span className="mr-3">🏠</span>
                Overview
              </Link>
              <Link
                href="/dashboard/orders"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <span className="mr-3">🛒</span>
                My Orders
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <span className="mr-3">👤</span>
                Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <span className="mr-3">⚙️</span>
                Settings
              </Link>

              {/* Admin Link - Only show if user is admin */}
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center px-4 py-3 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg mt-4"
                >
                  <span className="mr-3">🛡️</span>
                  Admin Panel
                </Link>
              )}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}