'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/lib/WishlistContext';
import ProductCard from '@/components/products/ProductCard';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

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
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: {
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.2 }
    }
};

export default function WishlistPage() {
    const { items } = useWishlist();

    return (
        <div className="min-h-screen bg-gray-50 font-jost pb-20">
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80"
                        alt="Wishlist Background"
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
                            Saved For Later
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            Your <br /> Wishlist
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium">
                            Keep track of products you love.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {items.length === 0 ? (
                        <motion.div
                            key="empty-state"
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                                className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg text-gray-300"
                            >
                                <Heart size={40} />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-black mb-4">Your wishlist is empty</h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                You haven't added any products yet. Browse our collection and find something you love!
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center px-8 py-4 bg-black text-white rounded-full font-black uppercase tracking-[0.2em] text-[12px] hover:scale-105 transition-transform"
                            >
                                <ShoppingBag size={16} className="mr-3" />
                                Start Shopping
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div key="list-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-gray-500 font-medium">
                                    Showing <span className="text-black font-bold">{items.length}</span> saved items
                                </p>
                                <Link
                                    href="/products"
                                    className="flex items-center text-sm font-bold text-black hover:text-blue-600 transition-colors group"
                                >
                                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                    Continue Shopping
                                </Link>
                            </div>

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
                            >
                                <AnimatePresence>
                                    {items.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="show"
                                            exit="exit"
                                            className="origin-center"
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
