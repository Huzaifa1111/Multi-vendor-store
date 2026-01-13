import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register', '/about', '/products', '/contact'];
  const isPublicPath = publicPaths.some(path => pathname === path);
  
  // Protected paths
  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // If no token and trying to access protected route, redirect to login
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If has token and trying to access login/register, redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};