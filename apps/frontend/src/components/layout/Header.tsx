'use client';

import { useAuth } from "@/lib/auth";
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Instagram,
  Facebook,
  ChevronDown,
  Menu,
  X,
  Crown
} from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle intersection/scroll logic
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Always show at the top
    if (currentScrollY < 100) {
      setIsVisible(true);
      setLastScrollY(currentScrollY);
      return;
    }

    if (currentScrollY > lastScrollY) {
      // Scrolling down
      setIsVisible(false);
    } else {
      // Scrolling up
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  // Handle mouse move to top
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (e.clientY < 50) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleScroll, handleMouseMove]);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/products', label: 'Products' },
    { href: '/contact', label: 'Contact Us' },
    ...(isAuthenticated ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <>
      {/* 1. Top Bar - Static (Scrolls Away) */}
      <div className="bg-white border-b border-gray-100 py-2 hidden md:block relative z-[60]">
        <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center text-[13px] font-medium text-gray-600">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Instagram size={14} />
              <span>100k Followers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Facebook size={14} />
              <span>300k Followers</span>
            </div>
          </div>

          <div className="flex-1 text-center">
            <span>Open Doors To A World Of Fashion | </span>
            <Link href="/products" className="underline underline-offset-4 hover:text-black transition-colors">Discover More</Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navbar - Smart Sticky */}
      <header
        style={{ top: lastScrollY === 0 ? '37px' : '0' }}
        className={`fixed left-0 right-0 z-50 bg-white transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
          } ${lastScrollY > 0 ? 'shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]' : ''
          } ${
          /* On mobile, lastScrollY is handled same but Top bar is hidden */
          'md:block'
          }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex justify-between items-center">
          {/* Left: Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-semibold text-black hover:text-gray-600 transition-colors uppercase tracking-tight"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-black hover:bg-gray-50 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-3xl font-bold tracking-tighter text-black hover:scale-105 transition-transform duration-300 flex items-center group">
              <span className="bg-black text-white px-2 py-0.5 rounded mr-1 group-hover:bg-blue-600 transition-colors">E</span>
              <span>Store</span>
              <span className="text-blue-600 animate-pulse">.</span>
            </Link>
          </div>

          {/* Right: Icons & Auth */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 md:space-x-5 text-black">
              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  onBlur={() => setTimeout(() => setIsAccountOpen(false), 200)}
                  className={`p-1.5 ${isAuthenticated ? 'px-3' : 'px-1.5'} hover:bg-gray-100 rounded-full transition-all flex items-center relative group space-x-2`}
                >
                  {user?.role === 'admin' ? (
                    <div className="relative">
                      <User size={20} className="text-purple-600" />
                      <Crown size={12} className="absolute -top-1.5 -right-1.5 text-yellow-500 fill-yellow-500 animate-bounce" />
                    </div>
                  ) : (
                    <User size={20} className={isAuthenticated ? "text-blue-600" : "text-gray-800"} />
                  )}

                  {isAuthenticated && (
                    <span className="hidden sm:inline-block text-[13px] font-bold text-black uppercase tracking-wider">
                      {user?.name?.split(' ')[0]}
                    </span>
                  )}

                  <ChevronDown size={12} className={`transition-transform duration-200 text-gray-400 ${isAccountOpen ? "rotate-180" : ""}`} />
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-[100] animate-in fade-in zoom-in duration-200 origin-top-right">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-50 flex flex-col">
                          <span className="text-sm font-bold truncate">{user?.name}</span>
                          <span className="text-xs text-gray-400 truncate">{user?.email}</span>
                          {user?.role === 'admin' && (
                            <span className="mt-1 text-[10px] uppercase font-black bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded w-fit">Admin</span>
                          )}
                        </div>
                        <Link href="/dashboard" className="block px-4 py-2.5 text-sm font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors">Dashboard</Link>
                        {user?.role === 'admin' && (
                          <Link href="/admin" className="block px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-50 transition-colors">Admin Panel</Link>
                        )}
                        <Link href="/profile" className="block px-4 py-2.5 text-sm font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors border-b border-gray-50">Profile Settings</Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Account</div>
                        <Link href="/auth/login" className="block px-4 py-2.5 text-sm font-bold hover:bg-gray-50 hover:text-blue-600 transition-colors">Login</Link>
                        <Link href="/auth/register" className="block px-4 py-2.5 text-sm font-bold hover:bg-gray-50 hover:text-blue-600 transition-colors border-t border-gray-50">Register</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button className="hidden sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search size={22} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <Heart size={22} />
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full leading-none">0</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <ShoppingBag size={22} />
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full leading-none">0</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-20 bg-white z-[60] overflow-y-auto p-6 animate-in slide-in-from-left duration-300">
            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xl font-bold text-black border-b border-gray-50 pb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-xl font-bold text-purple-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <div className="pt-6 flex flex-col space-y-4">
                {isAuthenticated ? (
                  <>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-bold">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <Button variant="secondary" onClick={handleLogout} className="w-full py-4 rounded-xl">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full py-4 rounded-xl">Login</Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full py-4 rounded-xl">Register</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
