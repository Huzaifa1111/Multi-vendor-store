'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { usersService, UpdateUserDto } from '@/services/users.service';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Save, Loader2, Camera, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
        }

        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '', // Assuming phone might be available on user object even if not in Interface strictly
            }));
        }
    }, [user, isAuthenticated, authLoading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setMessage(null);
        setIsLoading(true);

        try {
            if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
                throw new Error('New passwords do not match');
            }

            const updateData: UpdateUserDto = {
                name: formData.name,
                phone: formData.phone, // Include phone if your backend supports it
                // Only include password if provided
                ...(formData.newPassword ? { password: formData.newPassword } : {})
            };

            // Note: Typically email update requires re-verification, so we might want to disable it or handle it carefully.
            // For now, let's allow sending it if it changed.
            if (formData.email !== user.email) {
                updateData.email = formData.email;
            }

            const updatedUser = await usersService.updateProfile(user.id, updateData);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            // In a real app, you might want to refresh the auth context here
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || error.message || 'Failed to update profile'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <motion.div
            className="max-w-4xl mx-auto space-y-8 pb-12"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] bg-black p-8 md:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-purple-600 to-pink-600 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-blue-600 to-cyan-600 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-40 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1">
                            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                {/* Placeholder Avatar */}
                                <span className="text-4xl font-bold text-white">{user.name?.charAt(0) || 'U'}</span>
                            </div>
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                            <Camera size={18} />
                        </button>
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-blue-200 mb-2">
                            <Shield size={12} className="mr-1" /> {user.role?.toUpperCase() || 'USER'} account
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{user.name}</h1>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>
            </motion.div>

            <div className="flex justify-center">
                {/* Main Form */}
                <motion.div variants={itemVariants} className="w-full max-w-2xl">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">

                        {/* Decorative background element for the card */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                            </div>

                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl mb-6 flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full mr-3 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    {message.text}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled
                                                title="Contact support to change email"
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 font-medium cursor-not-allowed"
                                                placeholder="name@example.com"
                                            />
                                            <p className="text-xs text-gray-400 mt-1 ml-1">Email cannot be changed directly.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 mt-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleChange}
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Confirm Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="animate-spin mr-2" size={20} /> Saving...</>
                                        ) : (
                                            <><Save className="mr-2" size={20} /> Save Changes</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
