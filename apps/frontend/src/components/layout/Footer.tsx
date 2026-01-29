'use client';

import Link from 'next/link';
import {
    Package,
    CircleDollarSign,
    Headphones,
    CreditCard,
    ArrowRight,
    Facebook,
    Instagram,
    Twitter
} from 'lucide-react';

// Custom Pinterest icon
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
        <footer className="w-full bg-white font-jost border-t border-gray-100">
            {/* 1. Features Bar */}
            <div className="py-16 border-b border-gray-100">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="flex items-center space-x-6 group">
                            <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-emerald-50 text-black transition-all duration-300">
                                <Package size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-black">Free Shipping</h3>
                                <p className="text-gray-400 text-sm">On all orders over £130</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 group">
                            <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-emerald-50 text-black transition-all duration-300">
                                <CircleDollarSign size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-black">Money Guarantee</h3>
                                <p className="text-gray-400 text-sm">30 days for free returns</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 group">
                            <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-emerald-50 text-black transition-all duration-300">
                                <Headphones size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-black">Online Support</h3>
                                <p className="text-gray-400 text-sm">Dedicated 24/7 service</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 group">
                            <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-emerald-50 text-black transition-all duration-300">
                                <CreditCard size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-black">Secure Payment</h3>
                                <p className="text-gray-400 text-sm">Safe & flexible checkouts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Footer Links & Newsletter */}
            <div className="bg-white">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 pt-20 pb-12 gap-x-8">

                    {/* Column 1: Company */}
                    <div className="mb-12">
                        <h4 className="font-black text-[12px] uppercase tracking-[0.25em] mb-8 text-black">Contact Us</h4>
                        <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed">
                            <p>Find a location nearest you.</p>
                            <Link href="#" className="inline-block text-black font-bold border-b-2 border-black pb-1 hover:bg-emerald-50 px-1 transition-all">
                                Our Stores
                            </Link>
                            <div className="pt-6 space-y-2">
                                <p className="font-bold text-black text-lg">+391 (0)35 2568 4593</p>
                                <p className="font-medium">concierge@estore.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Experience */}
                    <div className="mb-12">
                        <h4 className="font-black text-[12px] uppercase tracking-[0.25em] mb-8 text-black">Experience</h4>
                        <ul className="space-y-4 text-[15px] text-gray-500 font-medium">
                            <li><Link href="#" className="hover:text-black transition-colors">My Profile</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Order Tracking</Link></li>
                            <li><Link href="/wishlist" className="hover:text-black transition-colors">Wishlist</Link></li>
                            <li><Link href="/gift-cards" className="hover:text-black transition-colors">Gift Cards</Link></li>
                            <li><Link href="/sustainability" className="hover:text-black transition-colors">Sustainability</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Corporate */}
                    <div className="mb-12">
                        <h4 className="font-black text-[12px] uppercase tracking-[0.25em] mb-8 text-black">Corporate</h4>
                        <ul className="space-y-4 text-[15px] text-gray-500 font-medium">
                            <li><Link href="/our-story" className="hover:text-black transition-colors">Our Story</Link></li>
                            <li><Link href="/careers" className="hover:text-black transition-colors">Careers</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Cookie Settings</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div className="mb-12">
                        <h4 className="font-black text-[12px] uppercase tracking-[0.25em] mb-8 text-black">Connect</h4>
                        <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
                            Stay updated with the latest trends and exclusive offers directly in your inbox.
                        </p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 pr-12 text-[14px] outline-none focus:bg-white focus:border-black transition-all font-medium text-black"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border-2 border-black text-black p-2 rounded-lg hover:bg-emerald-50 transition-colors">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Bar */}
                <div className="border-t border-gray-50 py-10">
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-gray-400">

                        <div className="flex items-center space-x-4 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center text-[6px] font-black text-black">AMEX</div>
                            <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center text-[6px] font-black text-black">VISA</div>
                            <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center text-[6px] font-black text-black">MC</div>
                            <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center text-[6px] font-black text-black">APPLE</div>
                        </div>

                        <div className="text-[11px] font-black uppercase tracking-[0.5em] text-black">
                            © E-STORE {currentYear} — ALL RIGHTS RESERVED
                        </div>

                        <div className="flex items-center space-x-6 text-black">
                            <Link href="#" className="hover:scale-125 transition-transform"><Pinterest size={18} /></Link>
                            <Link href="#" className="hover:scale-125 transition-transform"><Facebook size={18} /></Link>
                            <Link href="#" className="hover:scale-125 transition-transform"><Instagram size={18} /></Link>
                            <Link href="#" className="hover:scale-125 transition-transform"><Twitter size={18} /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
