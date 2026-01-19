'use client';

import { motion } from 'framer-motion';

import Image from 'next/image';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-jost pb-24">
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80"
                        alt="Legal Background"
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
                            Privacy Policy
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
                            <h2 className="text-2xl font-bold text-black mb-4">1. Introduction</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Welcome to E-Store. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our website
                                and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-black mb-4">2. Information We Collect</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li><strong>Identity Data</strong> includes first name, maiden name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                                <li><strong>Financial Data</strong> includes bank account and payment card details.</li>
                                <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-black mb-4">3. How We Use Your Data</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal or regulatory obligation.</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-black mb-4">4. Data Security</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                                In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-black mb-4">5. Cookies</h2>
                            <p className="text-gray-600 leading-relaxed">
                                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
                                If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-black mb-4">6. Contact Us</h2>
                            <p className="text-gray-600 leading-relaxed">
                                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                                <span className="block mt-2 font-medium text-black">privacy@estore.com</span>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
