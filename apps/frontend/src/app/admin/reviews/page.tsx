// apps/frontend/src/app/admin/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Star,
    Search,
    ChevronRight,
    ArrowLeft,
    Calendar,
    User,
    Package,
    Loader2,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';
import { resolveProductImage } from '@/lib/image';

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
        images?: string[];
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
        } catch (err: any) {
            console.error('Failed to fetch reviews:', err);
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
                <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
            </div>
        );
    }

    if (selectedReview) {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-10">
                <button onClick={() => setSelectedReview(null)} className="flex items-center gap-3 text-gray-400 hover:text-black transition-colors font-black uppercase tracking-widest text-[10px]">
                    <ArrowLeft size={16} /> Back to Analysis
                </button>

                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100 p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-[2rem] bg-gray-50 overflow-hidden border border-gray-100 shadow-inner">
                                    <img
                                        src={resolveProductImage(selectedReview.product?.images || selectedReview.product?.image || '')}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{selectedReview.product?.name}</h2>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Product ID: {selectedReview.product?.id}</p>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 italic relative">
                                <MessageSquare className="absolute -top-4 -left-4 text-yellow-500 bg-white rounded-full p-2 shadow-sm" size={32} />
                                <p className="text-xl font-medium text-gray-700 leading-relaxed underline decoration-yellow-200 decoration-4 underline-offset-8">
                                    "{selectedReview.comment}"
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 text-left">Quality Score</p>
                                    <div className="flex gap-1 text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} size={24} className={i <= selectedReview.rating ? 'fill-current' : 'text-gray-100'} />
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Timestamp</p>
                                    <p className="text-sm font-black text-black">{new Date(selectedReview.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-900 text-white rounded-[2rem] shadow-2xl">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-yellow-500">Reviewer Dossier</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-black border border-white/10 uppercase">
                                        {selectedReview.user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-lg">{selectedReview.user?.name}</p>
                                        <p className="text-xs text-white/50">{selectedReview.user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div className="space-y-10 pb-10" variants={containerVariants} initial="hidden" animate="show">
            <motion.div variants={itemVariants} className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-50/50 to-orange-50/50 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 mb-3 tracking-tighter">Customer Impressions</h1>
                        <p className="text-gray-500 text-lg font-medium max-w-xl">Curating and analyzing authentic feedback from your elite community.</p>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by product, customer, or testimony keyword..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-yellow-50 transition-all font-bold text-gray-900"
                    />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Reviewer</th>
                            <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Selection</th>
                            <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Sentiment</th>
                            <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                            <th className="px-10 py-6 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredReviews.map((rev, idx) => (
                            <motion.tr key={rev.id} onClick={() => setSelectedReview(rev)} className="hover:bg-gray-50/80 transition-all cursor-pointer group">
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-500 uppercase text-xs border border-gray-100">
                                            {rev.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">{rev.user?.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{rev.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                                            <img src={resolveProductImage(rev.product?.images || rev.product?.image || '')} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 truncate max-w-[180px]">{rev.product?.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex gap-0.5 text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} size={12} className={i <= rev.rating ? 'fill-current' : 'text-gray-100'} />
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <button className="p-3 rounded-full bg-gray-50 text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                                        <ChevronRight size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </motion.div>
    );
}
pocket
