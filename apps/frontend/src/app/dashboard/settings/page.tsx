'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    Shield,
    Moon,
    Globe,
    Smartphone,
    Mail,
    Eye,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
};

interface ToggleProps {
    label: string;
    description?: string;
    enabled: boolean;
    onChange: (val: boolean) => void;
    icon?: React.ElementType;
}

const Toggle = ({ label, description, enabled, onChange, icon: Icon }: ToggleProps) => (
    <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
            {Icon && (
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                    <Icon size={20} />
                </div>
            )}
            <div>
                <p className="font-bold text-gray-900">{label}</p>
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
        >
            <span
                className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
            />
        </button>
    </div>
);

export default function SettingsPage() {
    const { logout } = useAuth();
    const [notifications, setNotifications] = useState({
        email: true,
        orders: true,
        promo: false,
        push: true
    });

    const [privacy, setPrivacy] = useState({
        publicProfile: false,
        shareActivity: true
    });

    const [appearance, setAppearance] = useState({
        darkMode: false,
    });

    return (
        <motion.div
            className="max-w-4xl mx-auto space-y-8 pb-12"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] bg-black p-8 md:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-green-500 to-emerald-700 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 opacity-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-40 pointer-events-none"></div>

                <div className="relative z-10">
                    <p className="text-green-300 font-medium mb-2 tracking-wide uppercase text-sm">Configuration</p>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Settings / Preferences</h1>
                    <p className="text-gray-400 max-w-xl text-lg">
                        Manage your account settings, notifications, and security preferences.
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Settings Panel */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">

                    {/* Notifications Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <Bell className="mr-3 text-blue-600" size={24} />
                            Notifications
                        </h2>
                        <div className="space-y-2 divide-y divide-gray-50">
                            <Toggle
                                label="Order Updates"
                                description="Get notified about your order status"
                                enabled={notifications.orders}
                                onChange={(v) => setNotifications(prev => ({ ...prev, orders: v }))}
                                icon={Smartphone}
                            />
                            <Toggle
                                label="Email Newsletters"
                                description="Receive updates about new products"
                                enabled={notifications.email}
                                onChange={(v) => setNotifications(prev => ({ ...prev, email: v }))}
                                icon={Mail}
                            />
                            <Toggle
                                label="Promotional Offers"
                                description="Get notified about sales and discounts"
                                enabled={notifications.promo}
                                onChange={(v) => setNotifications(prev => ({ ...prev, promo: v }))}
                                icon={Globe}
                            />
                        </div>
                    </div>

                    {/* Privacy & Security Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <Shield className="mr-3 text-green-600" size={24} />
                            Privacy & Security
                        </h2>
                        <div className="space-y-2 divide-y divide-gray-50">
                            <Toggle
                                label="Public Profile"
                                description="Allow others to see your wishlist and reviews"
                                enabled={privacy.publicProfile}
                                onChange={(v) => setPrivacy(prev => ({ ...prev, publicProfile: v }))}
                                icon={Eye}
                            />
                            <div className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors -mx-2 px-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Change Password</p>
                                        <p className="text-sm text-gray-500">Update your account password</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </motion.div>


                {/* Sidebar / Additional Settings */}
                <motion.div variants={itemVariants} className="space-y-6">
                    {/* Appearance */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <Moon className="mr-3 text-purple-600" size={24} />
                            Appearance
                        </h2>
                        <div className="space-y-2">
                            <Toggle
                                label="Dark Mode"
                                description="Switch to dark theme"
                                enabled={appearance.darkMode}
                                onChange={(v) => setAppearance(prev => ({ ...prev, darkMode: v }))}
                            />
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50 rounded-[2.5rem] p-8 border border-red-100 shadow-sm">
                        <h2 className="text-xl font-bold text-red-700 mb-4">Danger Zone</h2>
                        <p className="text-red-600/70 text-sm mb-6">
                            Irreversible actions related to your account.
                        </p>
                        <button
                            onClick={logout}
                            className="w-full py-3 bg-white border border-red-200 text-red-600 font-bold rounded-xl shadow-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                        >
                            <LogOut size={18} className="mr-2" />
                            Log Out
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
