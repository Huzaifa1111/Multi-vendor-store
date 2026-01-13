'use client';

import { useAuth } from "@/lib/auth";
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { logout } from '@/services/auth.service';
import { useState } from 'react';
import { authService } from '@/services/auth.service'; // Change this import


export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
     authService.logout(); // Call the logout method from the service
    window.location.href = '/login';
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/products', label: 'Products' },
    { href: '/contact', label: 'Contact Us' },
    ...(isAuthenticated ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    // Add admin link if user is admin
    ...(user?.role === 'admin' ? [{ 
      href: '/admin', 
      label: 'Admin',
      className: 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
    }] : []),
  ];

  return (
    <header className="bg-white shadow"> {/* Remove fixed class */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Store App
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-10 md:flex md:items-center md:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    link.className || 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="text-gray-700">
                    <span className="font-medium">{user?.name}</span>
                    {user?.role === 'admin' && (
                      <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <Button variant="secondary" onClick={handleLogout} size="sm">
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    link.className || 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="border-t border-gray-200 pt-4 pb-3">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.name}
                        {user?.role === 'admin' && (
                          <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={handleLogout}
                      className="w-full justify-center"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-center">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full justify-center">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}