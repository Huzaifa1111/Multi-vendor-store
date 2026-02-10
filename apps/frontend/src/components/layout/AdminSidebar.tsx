'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  Folder,
  Shield,
  PlusCircle,
  ArrowLeft,
  Mail
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/products/create', label: 'Add Product', icon: PlusCircle },
  { href: '/admin/categories', label: 'Categories', icon: Folder },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden sticky top-8">
        {/* Admin Header */}
        <div className="p-8 border-b border-gray-50 bg-gradient-to-br from-purple-50/80 to-blue-50/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200 text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 tracking-tight text-lg">Admin Panel</h3>
              <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">System Control</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-black text-white shadow-lg shadow-gray-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                  }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-2 border-t border-gray-50">
            <Link
              href="/"
              className="flex items-center px-4 py-3.5 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-black rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Back to Store
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}