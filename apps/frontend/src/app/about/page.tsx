'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Globe, Users, Zap } from 'lucide-react';

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
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-jost overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
            alt="Office Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[11px] mb-6 block">Our Story</span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black mb-8">
              Redefining <br className="hidden md:block" /> Digital Commerce
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
              We're building the future of shopping, one seamless experience at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                alt="Our Team"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[11px] mb-6 block">Our Mission</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-8 leading-tight">
                Driven by Innovation, <br /> Guided by Quality.
              </h2>
              <div className="space-y-6 text-gray-500 text-lg font-medium leading-relaxed">
                <p>
                  Founded in 2024, our journey began with a simple yet ambitious vision: to bridge the gap between premium technology and everyday accessibility. We believe that shopping online should be more than just a transaction; it should be an experience.
                </p>
                <p>
                  Today, we connect thousands of users with top-tier vendors, fostering a marketplace built on trust, efficiency, and cutting-edge design. Our team is dedicated to pushing the boundaries of what's possible in e-commerce.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-4xl font-black text-black mb-2">10k+</h3>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Active Users</p>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-black mb-2">50+</h3>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Brand Partners</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 bg-[#fafafa]">
        <div className="container mx-auto px-6">
          <motion.div
            {...fadeInUp}
            className="text-center mb-24"
          >
            <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[11px] mb-4 block">Why Choose Us</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-black">Our Core Values</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: <Zap size={32} />, title: "Innovation", desc: "Always getting better." },
              { icon: <CheckCircle2 size={32} />, title: "Quality", desc: "Only the best for you." },
              { icon: <Users size={32} />, title: "Community", desc: "Growing together." },
              { icon: <Globe size={32} />, title: "Sustainability", desc: "For a better future." },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-black mb-4">{item.title}</h3>
                <p className="text-gray-500 font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        {...fadeInUp}
        className="py-32 bg-white relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[11px] mb-6 block">Join The Revolution</span>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 text-black">Ready to Start?</h2>
          <p className="text-gray-500 text-xl mb-14 font-medium leading-relaxed">
            Experience the next generation of e-commerce. Browse our collections or get in touch with our diverse team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/products"
              className="group relative inline-flex items-center px-12 py-6 bg-black text-white rounded-full font-black uppercase tracking-[0.3em] text-[12px] overflow-hidden transition-all duration-500 hover:scale-105 shadow-2xl"
            >
              <span className="relative z-10 flex items-center">
                Shop Now <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" size={18} />
              </span>
              <div className="absolute inset-0 bg-blue-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
            </Link>

            <Link
              href="/contact"
              className="group relative inline-flex items-center px-12 py-6 bg-white border-2 border-black text-black rounded-full font-black uppercase tracking-[0.3em] text-[12px] overflow-hidden transition-all duration-500 hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                Contact Us
              </span>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-[100px]"></div>
      </motion.section>
    </div>
  );
}