'use client';

import Link from 'next/link';
import {
    Package,
    CircleDollarSign,
    Headphones,
    CreditCard,
    Mail,
    ArrowRight,
    Facebook,
    Instagram,
    Twitter
} from 'lucide-react';

// Custom Pinterest icon as it's missing from standard lucide-react in some versions
const Pinterest = ({ size = 20 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M8 20c.5-1.1 1.6-3 1.6-3s-.4-1.1-.4-2.6c0-2.4 1.4-4.2 3.1-4.2 1.5 0 2.2 1.1 2.2 2.4 0 1.5-.9 3.7-1.4 5.8-.4 1.7.9 3.1 2.6 3.1 3.1 0 5.5-3.3 5.5-8.1 0-4.2-3-7.2-7.4-7.2-4.8 0-7.7 3.6-7.7 7.4 0 1.5.6 3 1.3 3.9.1.2.2.3.1.5-.1.4-.3 1.3-.4 1.5-.1.2-.2.3-.4.2-2-.9-3.3-3.9-3.3-6.3 0-5.1 3.7-9.8 10.7-9.8 5.6 0 10 4 10 9.3 0 5.6-3.5 10.1-8.4 10.1-1.6 0-3.2-.8-3.7-1.8 0 0-.8 3.1-1 3.9-.4 1.4-1.4 3.1-2.1 4.2" />
    </svg>
);

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white dark:bg-gray-950 font-sans">
            {/* 1. Features Bar */}
            <div className="border-t border-b border-gray-100 dark:border-gray-900 py-16">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="flex items-center space-x-6">
                            <Package size={44} strokeWidth={1} className="text-black dark:text-white" />
                            <div>
                                <h3 className="font-bold text-lg text-black dark:text-white">Free Shipping</h3>
                                <p className="text-gray-400 text-sm">Free Shipping for orders over £130</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <CircleDollarSign size={44} strokeWidth={1} className="text-black dark:text-white" />
                            <div>
                                <h3 className="font-bold text-lg text-black dark:text-white">Money Guarantee</h3>
                                <p className="text-gray-400 text-sm">Within 30 days for an exchange.</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Headphones size={44} strokeWidth={1} className="text-black dark:text-white" />
                            <div>
                                <h3 className="font-bold text-lg text-black dark:text-white">Online Support</h3>
                                <p className="text-gray-400 text-sm">24 hours a day, 7 days a week</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <CreditCard size={44} strokeWidth={1} className="text-black dark:text-white" />
                            <div>
                                <h3 className="font-bold text-lg text-black dark:text-white">Flexible Payment</h3>
                                <p className="text-gray-400 text-sm">Pay with Multiple Credit Cards</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Footer Links & Newsletter */}
            <div className="bg-[#f9f9f9] dark:bg-gray-950/20">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-gray-100 dark:border-gray-900">

                    {/* Column 1: Company */}
                    <div className="py-20 lg:pr-12 lg:border-r border-gray-100 dark:border-gray-900">
                        <h4 className="font-bold text-[14px] uppercase tracking-[0.2em] mb-8 text-black dark:text-white">Company</h4>
                        <div className="space-y-4 text-[14px] text-gray-500 leading-relaxed">
                            <p>Find a location nearest you.</p>
                            <Link href="#" className="inline-block text-black dark:text-white border-b border-black dark:border-white pb-0.5 hover:opacity-70 transition-opacity">
                                See Our Stores
                            </Link>
                            <div className="pt-4 space-y-1">
                                <p className="font-medium text-black dark:text-white">+391 (0)35 2568 4593</p>
                                <p>hello@domain.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Information */}
                    <div className="py-20 lg:px-12 lg:border-r border-gray-100 dark:border-gray-900">
                        <h4 className="font-bold text-[14px] uppercase tracking-[0.2em] mb-8 text-black dark:text-white">Information</h4>
                        <ul className="space-y-4 text-[14px] text-gray-500">
                            <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">My Account</Link></li>
                            <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Login</Link></li>
                            <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">My Cart</Link></li>
                            <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Wishlist</Link></li>
                            <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Checkout</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Services */}
                    <div className="py-20 lg:px-12 lg:border-r border-gray-100 dark:border-gray-900">
                        <h4 className="font-bold text-[14px] uppercase tracking-[0.2em] mb-8 text-black dark:text-white">Services</h4>
                        <ul className="space-y-4 text-[14px] text-gray-500">
                            <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Delivery Information</Link></li>
                            <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms & Condition</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Subscribe */}
                    <div className="py-20 lg:pl-12">
                        <h4 className="font-bold text-[14px] uppercase tracking-[0.2em] mb-8 text-black dark:text-white">Subscribe</h4>
                        <p className="text-[14px] text-gray-500 mb-8 leading-relaxed">
                            Enter your email below to be the first to know about new collections and product launches.
                        </p>
                        <div className="relative flex items-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-sm p-1 shadow-sm">
                            <Mail size={18} className="text-black dark:text-white ml-3" />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full bg-transparent px-3 py-2.5 text-[14px] outline-none text-black dark:text-white"
                            />
                            <button className="pr-3 hover:translate-x-1 transition-transform">
                                <ArrowRight size={20} className="text-black dark:text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Bar */}
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-[13px] text-gray-500">

                    {/* Payment Logos */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-6 bg-[#0070ba]/10 rounded flex items-center justify-center text-[8px] font-bold text-[#0070ba]">AMEX</div>
                        <div className="w-10 h-6 bg-[#4285f4]/10 rounded flex items-center justify-center text-[8px] font-bold text-[#4285f4]">G Pay</div>
                        <div className="w-10 h-6 bg-[#eb001b]/10 rounded flex items-center justify-center text-[8px] font-bold text-[#eb001b]">MC</div>
                        <div className="w-10 h-6 bg-[#003087]/10 rounded flex items-center justify-center text-[8px] font-bold text-[#003087]">PayPal</div>
                        <div className="w-10 h-6 bg-[#0070e0]/10 rounded flex items-center justify-center text-[8px] font-bold text-[#0070e0]">OPay</div>
                        <div className="w-10 h-6 bg-[#1a1f71]/10 rounded flex items-center justify-center text-[8px] font-bold text-[#1a1f71]">VISA</div>
                    </div>

                    <div className="uppercase tracking-[0.3em] font-medium text-[11px] text-black dark:text-white">
                        © E-STORE {currentYear}
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center space-x-6 text-black dark:text-white">
                        <Link href="#" className="hover:opacity-60 transition-opacity"><Pinterest size={18} /></Link>
                        <Link href="#" className="hover:opacity-60 transition-opacity"><Facebook size={18} /></Link>
                        <Link href="#" className="hover:opacity-60 transition-opacity"><Instagram size={18} /></Link>
                        <Link href="#" className="hover:opacity-60 transition-opacity"><Twitter size={18} /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
