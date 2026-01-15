'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        subtitle: 'Welcome to Estore',
        title: 'Next-Gen\nElectronics.',
        description: 'Discover the latest in technology and innovation. Your one-stop shop for premium electronics and gadgets.',
        image: '/images/hero/Estore Electronics.webp',
        link: '/products',
        textColor: 'text-white',
        accentColor: 'bg-white',
    }
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Parallax effect for the image container
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 10000); // Slower interval for better appreciation
        return () => clearInterval(timer);
    }, []);

    // Split title into characters for animation
    const splitTitle = (title: string) => {
        return title.split('').map((char, index) => (
            <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.8,
                    delay: 0.5 + index * 0.03,
                    ease: [0.22, 1, 0.36, 1]
                }}
                className="inline-block"
            >
                {char === '\n' ? <br /> : char}
            </motion.span>
        ));
    };

    return (
        <section ref={containerRef} className="relative h-[500px] md:h-[650px] bg-black overflow-hidden font-jost border-b border-gray-100">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                >
                    <div className="relative h-full w-full flex items-center justify-center">
                        {/* Centered Background Image */}
                        <motion.div
                            style={{ y: y1 }}
                            className="absolute inset-0 z-0 flex items-center justify-center"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={slides[currentSlide].image}
                                    alt={slides[currentSlide].title}
                                    fill
                                    className="object-cover"
                                    priority
                                    quality={100}
                                />
                                {/* Dark Gradient Overlay for White Text */}
                                <div className="absolute inset-0 bg-black/40"></div>
                            </div>
                        </motion.div>

                        {/* Centered Content Container */}
                        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
                            <div className="max-w-4xl">
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                    className="mb-6 flex items-center justify-center space-x-4"
                                >
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: 40 }}
                                        transition={{ delay: 0.4, duration: 1 }}
                                        className={`h-[1px] ${slides[currentSlide].accentColor}`}
                                    ></motion.div>
                                    <span className={`text-[11px] font-black uppercase tracking-[0.4em] ${slides[currentSlide].textColor}`}>
                                        {slides[currentSlide].subtitle}
                                    </span>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: 40 }}
                                        transition={{ delay: 0.4, duration: 1 }}
                                        className={`h-[1px] ${slides[currentSlide].accentColor}`}
                                    ></motion.div>
                                </motion.div>

                                <h1 className={`text-4xl md:text-5xl lg:text-7xl font-bold leading-[1] tracking-tighter mb-6 ${slides[currentSlide].textColor}`}>
                                    {splitTitle(slides[currentSlide].title)}
                                </h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                    className={`text-sm md:text-base font-medium max-w-lg mx-auto mb-8 opacity-90 leading-relaxed ${slides[currentSlide].textColor}`}
                                >
                                    {slides[currentSlide].description}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1, duration: 0.8 }}
                                    className="flex flex-wrap justify-center gap-6"
                                >
                                    <Link
                                        href={slides[currentSlide].link}
                                        className="group relative px-10 py-5 bg-white border-2 border-white text-black font-black uppercase tracking-[0.2em] text-[11px] overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-lg"
                                    >
                                        <span className="relative z-10 flex items-center group-hover:tracking-[0.3em] transition-all duration-500">
                                            Shop Now <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform duration-500 text-black" size={18} />
                                        </span>
                                    </Link>

                                    <Link
                                        href="/products"
                                        className="group relative px-10 py-5 border-2 border-white text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black transition-all duration-500 overflow-hidden"
                                    >
                                        <span className="relative z-10 transition-all duration-500 group-hover:tracking-[0.3em]">Explore All</span>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Subtle Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <div className="absolute inset-y-0 left-4 md:left-8 z-30 flex items-center">
                        <button
                            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                            className="p-3 rounded-full hover:bg-black/5 transition-colors border border-black/10 group active:scale-90"
                        >
                            <ArrowRight className="rotate-180 text-black group-hover:-translate-x-1 transition-transform" size={24} />
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-4 md:right-8 z-30 flex items-center">
                        <button
                            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                            className="p-3 rounded-full hover:bg-black/5 transition-colors border border-black/10 group active:scale-90"
                        >
                            <ArrowRight className="text-black group-hover:translate-x-1 transition-transform" size={24} />
                        </button>
                    </div>
                </>
            )}

            {/* Decorative vertical reveal */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: "15%" }}
                transition={{ delay: 2, duration: 1.5 }}
                className="absolute right-12 top-0 w-[1px] bg-black/10 hidden lg:block"
            ></motion.div>

            <div className="absolute right-12 bottom-12 hidden lg:flex flex-col items-center space-y-12 z-20">
                <motion.span
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-[10px] font-black uppercase tracking-[0.6em] rotate-90 mb-12 whitespace-nowrap opacity-40"
                >
                    SCROLL
                </motion.span>
                <div className="w-[1px] h-40 bg-gradient-to-b from-black/0 via-black/40 to-black"></div>
            </div>
        </section>
    );
}
