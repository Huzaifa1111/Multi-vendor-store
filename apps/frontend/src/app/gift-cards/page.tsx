'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Check, CreditCard, Gift, Send, Sparkles } from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

// Define card tiers with associated values, styles, and benefits
const cardTiers: Record<number, { name: string; gradient: string; text: string; discount: string; shadow: string }> = {
    50: {
        name: 'SILVER',
        gradient: 'from-gray-300 via-gray-100 to-gray-400',
        text: 'text-gray-800',
        discount: 'Includes 2% Store Credit Bonus',
        shadow: 'shadow-gray-300/50'
    },
    100: {
        name: 'GOLD',
        gradient: 'from-yellow-200 via-yellow-400 to-yellow-600',
        text: 'text-yellow-900',
        discount: 'Includes 5% Store Credit Bonus',
        shadow: 'shadow-yellow-400/50'
    },
    200: {
        name: 'PLATINUM',
        gradient: 'from-slate-300 via-slate-100 to-slate-400',
        text: 'text-slate-800',
        discount: 'Includes 10% Store Credit Bonus',
        shadow: 'shadow-slate-400/50'
    },
    500: {
        name: 'DIAMOND',
        gradient: 'from-gray-900 via-gray-800 to-black',
        text: 'text-white',
        discount: 'Includes 15% Store Credit Bonus + VIP Status',
        shadow: 'shadow-black/50'
    }
};

const cardValues = Object.keys(cardTiers).map(Number).sort((a, b) => a - b);

export default function GiftCardsPage() {
    const [selectedValue, setSelectedValue] = useState(100);
    const [formState, setFormState] = useState({
        recipientName: '',
        recipientEmail: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const currentTier = cardTiers[selectedValue];

    return (
        <div className="min-h-screen bg-gray-50 font-jost pb-24">
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80"
                        alt="Gift Background"
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
                            The Perfect Present
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            Give the Gift <br /> of Choice
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium">
                            Instant delivery. Thousands of options. The ultimate shopping experience, wrapped up in one digital card.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Left Column: Visual Card Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="sticky top-32"
                    >
                        <motion.div
                            layout
                            className={`relative aspect-[1.586/1] w-full max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl transition-shadow duration-500 hover:scale-[1.02] ${currentTier.shadow}`}
                        >
                            {/* Dynamic Card Background */}
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${currentTier.gradient} transition-colors duration-700 z-0`}
                                initial={false}
                                animate={{ opacity: 1 }}
                            ></motion.div>

                            {/* Decorative Shine */}
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 mix-blend-overlay"></div>

                            {/* Card Content */}
                            <div className={`relative z-10 p-8 md:p-12 h-full flex flex-col justify-between ${currentTier.text} transition-colors duration-500`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight mb-1">E-STORE</h3>
                                        <p className="text-xs font-medium tracking-[0.3em] uppercase opacity-70">
                                            {currentTier.name} CARD
                                        </p>
                                    </div>
                                    <Gift size={32} strokeWidth={1.5} className="opacity-80" />
                                </div>

                                <div>
                                    <div className="mb-6">
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Value</p>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={selectedValue}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="text-5xl md:text-6xl font-black tracking-tighter"
                                            >
                                                ${selectedValue}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="font-mono text-sm opacity-60">
                                            •••• •••• •••• 1234
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Dynamic Discount Info */}
                        <motion.div
                            layout
                            key={selectedValue}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 bg-white p-6 rounded-2xl shadow-sm text-center border-l-4 border-blue-600"
                        >
                            <h4 className="font-black uppercase tracking-widest text-sm text-gray-900 mb-2">
                                {currentTier.name} TIER BENEFITS
                            </h4>
                            <p className="text-lg font-medium text-blue-600">
                                {currentTier.discount}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                Discount rates increase with higher value cards.
                            </p>
                        </motion.div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                            {[
                                { icon: <Send size={24} />, title: "Instant Delivery", desc: "Sent via email immediately" },
                                { icon: <Sparkles size={24} />, title: "No Expiration", desc: "Valid forever on all items" },
                                { icon: <CreditCard size={24} />, title: "Secure", desc: "Safe payment processing" },
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                        {item.icon}
                                    </div>
                                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: Configuration Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl"
                    >
                        <h2 className="text-3xl font-black mb-8">Configure Gift Card</h2>

                        {/* Value Selector */}
                        <div className="mb-10">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Select Amount</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {cardValues.map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => setSelectedValue(value)}
                                        className={`relative py-4 rounded-xl border-2 font-black text-lg transition-all duration-300 ${selectedValue === value
                                            ? 'border-black bg-black text-white scale-105 shadow-lg'
                                            : 'border-gray-100 bg-white text-gray-900 hover:border-gray-300'
                                            }`}
                                    >
                                        ${value}
                                        {selectedValue === value && (
                                            <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full p-1">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Recipient Name</label>
                                <input
                                    type="text"
                                    name="recipientName"
                                    placeholder="Enter name"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl px-5 py-4 outline-none transition-all font-medium text-black"
                                    value={formState.recipientName}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Recipient Email</label>
                                <input
                                    type="email"
                                    name="recipientEmail"
                                    placeholder="Enter email address"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl px-5 py-4 outline-none transition-all font-medium text-black"
                                    value={formState.recipientEmail}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Personal Message (Optional)</label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    placeholder="Write a sweet note..."
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl px-5 py-4 outline-none transition-all font-medium resize-none text-black"
                                    value={formState.message}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-10 pt-8 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-500 font-medium">Total Price</span>
                                <span className="text-4xl font-black text-black">${selectedValue}.00</span>
                            </div>

                            <motion.button
                                whileHover="hover"
                                whileTap="tap"
                                variants={{
                                    hover: { scale: 1.02 },
                                    tap: { scale: 0.98 }
                                }}
                                className="relative w-full py-5 bg-blue-600 text-white rounded-xl font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-blue-500/50 overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Add to Cart
                                </span>
                                {/* Shimmer Effect */}
                                <motion.div
                                    variants={{
                                        hover: {
                                            x: ["-100%", "200%"],
                                            transition: {
                                                repeat: Infinity,
                                                duration: 1.5,
                                                ease: "linear"
                                            }
                                        }
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 w-full h-full -translate-x-full"
                                />
                            </motion.button>
                            <p className="text-center text-xs text-gray-400 mt-4">
                                Digital gift card will be delivered via email immediately after purchase.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
