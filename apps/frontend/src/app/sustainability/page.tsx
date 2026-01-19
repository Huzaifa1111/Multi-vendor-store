'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Recycle, Heart, Droplets, Sun, Wind } from 'lucide-react';
import { useRef } from 'react';

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "anticipate" } as any
};

const staggerContainer = {
    initial: {},
    whileInView: {
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function SustainabilityPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <div className="min-h-screen bg-white font-jost overflow-x-hidden" ref={containerRef}>
            {/* Parallax Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"
                        alt="Nature Background"
                        fill
                        className="object-cover brightness-75"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white"></div>
                </motion.div>

                <div className="container mx-auto px-6 relative z-10 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 backdrop-blur-md border border-green-400/30 text-green-300 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
                            Our Commitment
                        </span>
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-tight">
                            Commerce in <br /> <span className="text-green-400">Harmony</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
                            We believe in a future where style involves responsibility. Every product tells a story of preservation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-24 bg-white relative z-20 -mt-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            { label: "Carbon Neutral", value: "100%", desc: "Shipping & Operations" },
                            { label: "Recycled Materials", value: "85%", desc: "Across all packaging" },
                            { label: "Trees Planted", value: "50k+", desc: "In partnership with OneTree" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="bg-gray-50 p-10 rounded-[2rem] text-center hover:bg-green-50 transition-colors duration-500 group"
                            >
                                <h3 className="text-6xl font-black text-black mb-2 group-hover:text-green-600 transition-colors">{stat.value}</h3>
                                <p className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">{stat.label}</p>
                                <p className="text-gray-500 font-medium">{stat.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission Split Section */}
            <section className="py-24 md:py-32 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-black mb-8">
                                The Green <br /> Standard.
                            </h2>
                            <div className="space-y-6 text-lg text-gray-500 font-medium leading-relaxed">
                                <p>
                                    Traditional e-commerce leaves a heavy footprint. We're rewriting the rules. From sourcing organic cotton to using biodegradable mailers, every decision is weighed against its environmental impact.
                                </p>
                                <p>
                                    We don't just ask "is it profitable?" We ask "is it sustainable?" If the answer is no, we go back to the drawing board.
                                </p>
                            </div>
                            <div className="mt-10">
                                <Link href="/products" className="text-green-600 font-black uppercase tracking-widest text-sm border-b-2 border-green-600 pb-1 hover:text-black hover:border-black transition-all">
                                    Read Our Full Report
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden relative z-10">
                                <Image
                                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80" // Reusing distinct nature image or finding another
                                    alt="Sustainable Materials"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-100 rounded-full blur-3xl z-0"></div>
                            <div className="absolute -top-10 -right-10 w-60 h-60 bg-blue-100 rounded-full blur-3xl z-0"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pillars Grid */}
            <section className="py-32 bg-[#fafafa]">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-green-600 font-black uppercase tracking-[0.4em] text-[11px] mb-4 block">Our Pillars</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black">Designed for the Future</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <Leaf size={28} />, title: "Eco-Friendly Materials", desc: "Organic cottons, recycled polyesters, and responsibly sourced woods." },
                            { icon: <Recycle size={28} />, title: "Circular Economy", desc: "Programs to repair, resell, and recycle used products." },
                            { icon: <Wind size={28} />, title: "Clean Energy", desc: "Warehouses powered by 100% renewable solar and wind energy." },
                            { icon: <Droplets size={28} />, title: "Water Conservation", desc: "Closed-loop dyeing processes that save millions of liters." },
                            { icon: <Heart size={28} />, title: "Ethical Labor", desc: "Fair wages and safe working conditions for all makers." },
                            { icon: <Sun size={28} />, title: "Transparency", desc: "Full visibility into our supply chain and impact reports." },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="py-32 bg-green-900 text-white relative overflow-hidden"
            >
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-10">
                        Join the Movement
                    </h2>
                    <p className="text-xl md:text-2xl text-green-100 mb-12 max-w-2xl mx-auto font-medium">
                        Make a choice that matters. Shop our curated collection of sustainable goods.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center px-12 py-6 bg-white text-green-900 rounded-full font-black uppercase tracking-[0.2em] text-[12px] hover:scale-105 transition-transform duration-300"
                    >
                        Shop Consciously <ArrowRight className="ml-3" size={18} />
                    </Link>
                </div>

                {/* Decorative Nature Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <Image
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80"
                        alt="Texture"
                        fill
                        className="object-cover"
                    />
                </div>
            </motion.section>
        </div>
    );
}
