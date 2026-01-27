'use client';

import { useState, useEffect } from 'react';
import {
    Mail,
    Search,
    MoreVertical,
    Loader2,
    Calendar,
    User,
    MessageSquare,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
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

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await api.get('/contact');
            setMessages(response.data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch messages:', err);
            setError(err.message || 'Failed to load messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredMessages = messages.filter(msg => {
        const nameMatch = (msg.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = (msg.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const subjectMatch = (msg.subject || '').toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || emailMatch || subjectMatch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (selectedMessage) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                <button
                    onClick={() => setSelectedMessage(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold"
                >
                    <ArrowLeft size={20} />
                    Back to Messages
                </button>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8 md:p-12 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="space-y-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-rose-100 text-rose-600 border border-rose-200">
                                {selectedMessage.subject}
                            </span>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{selectedMessage.name}</h1>
                            <p className="text-gray-500 font-medium flex items-center gap-2">
                                <Mail size={16} /> {selectedMessage.email}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center justify-end gap-2">
                                <Calendar size={16} />
                                {new Date(selectedMessage.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50/50 rounded-[2rem] p-8 md:p-10 border border-gray-100">
                        <div className="flex gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                                <MessageSquare size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Message Content</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg font-medium">
                            {selectedMessage.message}
                        </p>
                    </div>

                    <div className="mt-10 flex justify-end">
                        <a
                            href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                            className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black shadow-lg shadow-rose-200 transition-all hover:-translate-y-0.5"
                        >
                            Reply via Email
                        </a>
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
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-rose-50 to-orange-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Messages</h1>
                    <p className="text-gray-500 text-lg">Inquiries and messages from your customers.</p>
                </div>
            </motion.div>

            {/* Filters and Search */}
            <motion.div variants={itemVariants} className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, email or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-100 focus:border-rose-500 transition-all font-medium text-gray-900"
                    />
                </div>
            </motion.div>

            {/* Messages List */}
            <motion.div variants={itemVariants} className="space-y-4">
                {error ? (
                    <div className="text-center py-12 bg-white rounded-[2.5rem] border border-gray-100">
                        <p className="text-red-500 font-medium mb-4">{error}</p>
                        <button
                            onClick={fetchMessages}
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
                                        <th className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Sender</th>
                                        <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Subject</th>
                                        <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Date</th>
                                        <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredMessages.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Mail size={40} className="text-gray-200" />
                                                    <span className="font-semibold text-gray-900">No messages found</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMessages.map((msg, index) => (
                                            <motion.tr
                                                key={msg.id}
                                                className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => setSelectedMessage(msg)}
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                                                            {msg.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900">{msg.name}</div>
                                                            <div className="text-xs text-gray-500">{msg.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-sm font-bold text-gray-700">{msg.subject}</span>
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{msg.message}</p>
                                                </td>
                                                <td className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    {new Date(msg.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button className="p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
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
