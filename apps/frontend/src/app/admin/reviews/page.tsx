'use client';

import { useState, useEffect } from 'react';
import {
    Star,
    Search,
    MoreVertical,
    Loader2,
    Calendar,
    User,
    Package,
    ChevronRight,
    ArrowLeft,
    Trash2,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
        picture?: string;
    };
    product: {
        id: number;
        name: string;
        image?: string;
    };
}

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

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reviews');
            setReviews(response.data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch reviews:', err);
            setError(err.message || 'Failed to load reviews. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredReviews = reviews.filter(rev => {
        const nameMatch = (rev.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const productNameMatch = (rev.product?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const commentMatch = (rev.comment || '').toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || productNameMatch || commentMatch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (selectedReview) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                <button
                    onClick={() => setSelectedReview(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold"
                >
                    <ArrowLeft size={20} />
                    Back to Reviews
                </button>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8 md:p-12 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                                {selectedReview.product?.image ? (
                                    <img src={selectedReview.product.image} alt={selectedReview.product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Package className="text-gray-300" size={32} />
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">{selectedReview.product?.name}</h1>
                                <p className="text-gray-500 font-medium">Review ID: {selectedReview.id}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex gap-1 justify-end text-yellow-400 mb-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={20} className={i <= selectedReview.rating ? 'fill-yellow-400' : 'text-gray-200'} />
                                ))}
                            </div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center justify-end gap-2">
                                <Calendar size={16} />
                                {new Date(selectedReview.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100">
                                <div className="flex gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-yellow-101 text-yellow-600 flex items-center justify-center flex-shrink-0">
                                        <MessageSquare size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Review Comment</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-lg font-medium italic">
                                    "{selectedReview.comment}"
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Reviewer Information</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold overflow-hidden border border-blue-100">
                                        {selectedReview.user?.picture ? (
                                            <img src={selectedReview.user.picture} alt={selectedReview.user.name} />
                                        ) : (
                                            selectedReview.user?.name?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{selectedReview.user?.name}</p>
                                        <p className="text-xs text-gray-500 font-medium">{selectedReview.user?.email}</p>
                                    </div>
                                </div>
                                <Link href={`/admin/users?search=${selectedReview.user?.email}`} className="text-blue-600 text-sm font-black hover:underline">
                                    View User Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="space-y-8 pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-yellow-50 to-orange-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Customer Reviews</h1>
                    <p className="text-gray-500 text-lg">Monitor and manage product ratings from your customers.</p>
                </div>
            </motion.div>

            {/* Filters and Search */}
            <motion.div variants={itemVariants} className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by product, customer or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 transition-all font-medium text-gray-900"
                    />
                </div>
            </motion.div>

            {/* Reviews List */}
            <motion.div variants={itemVariants} className="space-y-4">
                {error ? (
                    <div className="text-center py-12 bg-white rounded-[2.5rem] border border-gray-100">
                        <p className="text-red-500 font-medium mb-4">{error}</p>
                        <button
                            onClick={fetchReviews}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Reviewer</th>
                                        <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Product</th>
                                        <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Rating</th>
                                        <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Date</th>
                                        <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredReviews.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Star size={40} className="text-gray-200" />
                                                    <span className="font-semibold text-gray-900">No reviews found</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredReviews.map((rev, index) => (
                                            <motion.tr
                                                key={rev.id}
                                                className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => setSelectedReview(rev)}
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-50 overflow-hidden">
                                                            {rev.user?.picture ? (
                                                                <img src={rev.user.picture} alt={rev.user.name} />
                                                            ) : (
                                                                rev.user?.name?.charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900">{rev.user?.name}</div>
                                                            <div className="text-xs text-gray-500 font-medium">{rev.user?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        {rev.product?.image && (
                                                            <img src={rev.product.image} alt="" className="w-6 h-6 rounded object-cover border border-gray-100" />
                                                        )}
                                                        <span className="text-sm font-bold text-gray-700 truncate max-w-[150px]">{rev.product?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex gap-0.5 text-yellow-400">
                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                            <Star key={i} size={12} className={i <= rev.rating ? 'fill-yellow-400' : 'text-gray-200'} />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    {new Date(rev.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button className="p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-yellow-500 group-hover:text-white transition-all">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
