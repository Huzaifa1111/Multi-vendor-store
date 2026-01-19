'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-gray-50 font-jost pb-24">
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"
                        alt="Terms Background"
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
                            Legal Docs
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            Terms of Service
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium">
                            Last updated: January 2026
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <div className="container mx-auto px-6 -mt-20 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100"
                >
                    <div className="prose prose-lg prose-gray max-w-none">
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-black mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 leading-relaxed">
                                By accessing and placing an order with E-Store, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below.
                                These terms apply to the entire website and any email or other type of communication between you and E-Store.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-black mb-4">2. License</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                E-Store grants you a revocable, non-exclusive, non-transferable, limited license to download, install and use the website strictly in accordance with the terms of this Agreement.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-black mb-4">3. Restrictions</h2>
                            <p className="text-gray-600 leading-relaxed">
                                You agree not to, and you will not permit others to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                                <li>License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the service.</li>
                                <li>Modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the service.</li>
                                <li>Remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) of E-Store or its affiliates.</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-black mb-4">4. Your Account</h2>
                            <p className="text-gray-600 leading-relaxed">
                                If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.
                                You may not assign or otherwise transfer your account to any other person or entity.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-black mb-4">5. Modifications to Service</h2>
                            <p className="text-gray-600 leading-relaxed">
                                E-Store reserves the right to modify, suspend or discontinue, temporarily or permanently, the service or any service to which it connects, with or without notice and without liability to you.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-black mb-4">6. Updates to Terms</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We may change our Service and policies, and we may need to make changes to these Terms so that they accurately reflect our Service and policies.
                                Unless otherwise required by law, we will notify you (for example, through our Service) before we make changes to these Terms and give you an opportunity to review them before they go into effect.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
