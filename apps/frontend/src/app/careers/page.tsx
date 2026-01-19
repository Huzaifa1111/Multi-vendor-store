'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Briefcase, Globe, Zap, Coffee, Heart, Monitor, Clock, Shield } from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const staggerContainer = {
    initial: {},
    whileInView: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const jobs = [
    { title: "Senior Frontend Engineer", dep: "Engineering", loc: "Remote • US/EU", type: "Full-time" },
    { title: "Product Designer", dep: "Design", loc: "New York, NY", type: "Full-time" },
    { title: "Backend Architect", dep: "Engineering", loc: "Remote • Global", type: "Full-time" },
    { title: "Growth Marketing Manager", dep: "Marketing", loc: "London, UK", type: "Full-time" },
    { title: "Customer Success Lead", dep: "Operations", loc: "Remote • US", type: "Full-time" },
];

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white font-jost overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                        alt="Team Collaboration"
                        fill
                        className="object-cover opacity-30"
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
                            Join the Revolution
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Build the Future <br /> of Commerce
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-medium">
                            We're a team of dreamers, doers, and relentless innovators. Come do the best work of your life.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Values / Why Join */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[11px] mb-4 block">Our Culture</span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black">More Than Just a Job</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: <Globe size={32} />, title: "Remote First", desc: "Work from anywhere. We believe in output, not hours in a chair." },
                            { icon: <Zap size={32} />, title: "High Impact", desc: "Small teams, big autonomy. Your code ships to millions of users." },
                            { icon: <Heart size={32} />, title: "Wellness Focused", desc: "Comprehensive health coverage and unlimited mental health days." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center group"
                            >
                                <div className="w-20 h-20 bg-gray-50 text-black rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-24 bg-[#fafafa]">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-black">Perks that <br /> Power You</h2>
                            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                                We take care of the details so you can focus on the big picture. From state-of-the-art equipment to generous time off, we've got you covered.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { icon: <Monitor size={20} />, text: "Latest M3 MacBooks" },
                                    { icon: <Clock size={20} />, text: "Flexible Hours" },
                                    { icon: <Coffee size={20} />, text: "Co-working Stipend" },
                                    { icon: <Shield size={20} />, text: "Full Health Insurance" },
                                ].map((perk, i) => (
                                    <div key={i} className="flex items-center space-x-3 font-bold text-gray-800">
                                        <span className="text-blue-600">{perk.icon}</span>
                                        <span>{perk.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-200">
                                <Image
                                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80"
                                    alt="Office Perks"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs">
                                <div className="flex items-center space-x-4 mb-2">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"></div>
                                        ))}
                                    </div>
                                    <span className="font-bold text-sm">Join 50+ others</span>
                                </div>
                                <p className="text-xs text-gray-400">Our growing team of innovators.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Come and Invest Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-black">
                            Come and Invest with Us
                        </h2>
                        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                            We are looking for visionaries who want to shape the future. Apply now to become a part of our growth story.
                        </p>

                        <a
                            href="/contact"
                            className="inline-flex items-center px-12 py-6 bg-black text-white rounded-full font-black uppercase tracking-[0.2em] text-[12px] hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl"
                        >
                            Apply Now <ArrowRight className="ml-3" size={18} />
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
