'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Quote, Linkedin, Twitter, Mail } from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "anticipate" } as any
};

export default function OurStoryPage() {
    return (
        <div className="min-h-screen bg-white font-jost overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-gray-900 text-white">
                <div className="absolute inset-0 z-0 opacity-40">
                    {/* Abstract texture or office background */}
                    <Image
                        src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80"
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
                            Est. 2024
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-white">
                            The Journey
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
                            Two friends, one vision, and a relentless drive to redefine online commerce.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* The Beginning */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[11px] mb-6 block">How It Started</span>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black mb-10 leading-tight">
                            It started with a simple idea: <br />
                            <span className="text-gray-400">Quality shouldn't be complicated.</span>
                        </h2>
                        <p className="text-gray-500 text-lg md:text-xl leading-relaxed mb-12">
                            In a crowded market of endless options and confusing interfaces, we saw an opportunity to strip away the noise. We wanted to build a platform that didn't just sell products, but curated experiences. What began as late-night coding sessions in a university dorm has evolved into a global marketplace connecting thousands of creators and customers.
                        </p>
                        <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* The Founders */}
            <section className="py-24 bg-[#fafafa] relative overflow-hidden">
                {/* Decorative Blobs */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-gray-100 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-24"
                    >
                        <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[11px] mb-4 block">Leadership</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-black">The Visionaries</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">

                        {/* Founder 1: Wasik */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="group bg-white rounded-[2.5rem] p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-8">
                                <Image
                                    src="/images/hero/wasik.jpeg"
                                    alt="Wasik"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                </div>
                            </div>

                            <div className="px-6 pb-6 text-center">
                                <h3 className="text-4xl font-black text-black mb-2">Wasik Rehman</h3>
                                <div className="flex justify-center mb-6">
                                    <span className="py-1 px-4 border border-blue-100 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Co-Founder & CEO
                                    </span>
                                </div>
                                <p className="text-gray-500 leading-relaxed mb-8 max-w-sm mx-auto font-medium">
                                    "We're not just building a platform; we're crafting an ecosystem where quality meets innovation."
                                </p>

                                <div className="flex justify-center space-x-6 border-t border-gray-100 pt-8">
                                    <button className="text-gray-400 hover:text-black hover:scale-110 transition-all"><Linkedin size={20} /></button>
                                    <button className="text-gray-400 hover:text-black hover:scale-110 transition-all"><Twitter size={20} /></button>
                                    <button className="text-gray-400 hover:text-black hover:scale-110 transition-all"><Mail size={20} /></button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Founder 2: Huzaifa */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="group bg-white rounded-[2.5rem] p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-8">
                                <Image
                                    src="/images/hero/huzaifa.jpeg"
                                    alt="Huzaifa"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:-rotate-1"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                </div>
                            </div>

                            <div className="px-6 pb-6 text-center">
                                <h3 className="text-4xl font-black text-black mb-2">Muhammad Huzaifa</h3>
                                <div className="flex justify-center mb-6">
                                    <span className="py-1 px-4 border border-purple-100 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Co-Founder & CTO
                                    </span>
                                </div>
                                <p className="text-gray-500 leading-relaxed mb-8 max-w-sm mx-auto font-medium">
                                    "Technology should be invisible. If it works perfectly, you don't notice the code—you just feel the magic."
                                </p>

                                <div className="flex justify-center space-x-6 border-t border-gray-100 pt-8">
                                    <button className="text-gray-400 hover:text-black hover:scale-110 transition-all"><Linkedin size={20} /></button>
                                    <button className="text-gray-400 hover:text-black hover:scale-110 transition-all"><Twitter size={20} /></button>
                                    <button className="text-gray-400 hover:text-black hover:scale-110 transition-all"><Mail size={20} /></button>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-32 bg-black text-white text-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Quote size={48} className="text-blue-600 mx-auto mb-8 opacity-50" />
                    <h2 className="text-3xl md:text-5xl font-medium leading-tight mb-10">
                        "We didn't just want to build another store. We wanted to build a destination where technology meets artistry."
                    </h2>
                    <div className="flex items-center justify-center space-x-4 opacity-50">
                        <span className="h-px w-12 bg-white"></span>
                        <span className="uppercase tracking-[0.2em] text-sm">The Founders</span>
                        <span className="h-px w-12 bg-white"></span>
                    </div>
                </div>
            </section>
        </div>
    );
}
