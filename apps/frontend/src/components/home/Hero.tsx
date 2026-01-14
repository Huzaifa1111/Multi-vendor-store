'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Palette, LifeBuoy, BookOpen, ShoppingBag } from 'lucide-react';

const slides = [
    {
        id: 1,
        subtitle: 'New Arrivals',
        title: 'Autumn\nCollection',
        image: '/images/hero/autumn-collection.png',
        link: '/products?category=autumn',
        bgColor: 'bg-[#f5f5f5]',
    },
    {
        id: 2,
        subtitle: 'Winter Essentials',
        title: 'Modern\nMinimalist',
        image: '/images/hero/winter-essentials.png',
        link: '/products?category=winter',
        bgColor: 'bg-[#eeeeee]',
    },
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-[#f9f9f9]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`absolute inset-0 flex items-center ${slides[currentSlide].bgColor}`}
                >
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 items-center h-full relative">

                        {/* Text Content */}
                        <div className="z-10 pt-10 lg:pt-0">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-gray-700 mb-4 block"
                            >
                                {slides[currentSlide].subtitle}
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="text-5xl md:text-7xl lg:text-[100px] leading-[1.1] font-black text-black tracking-tighter whitespace-pre-line mb-8"
                            >
                                {slides[currentSlide].title}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                <Link
                                    href={slides[currentSlide].link}
                                    className="inline-block px-10 py-3.5 border border-black text-black dark:text-white text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 transform"
                                >
                                    Shop Now
                                </Link>
                            </motion.div>
                        </div>

                        {/* Image Content */}
                        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 h-full z-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={slides[currentSlide].image}
                                    alt={slides[currentSlide].title}
                                    fill
                                    className="object-cover object-center lg:object-right-top"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col space-y-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="group relative flex items-center justify-center p-2"
                    >
                        <div
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-black w-2 h-2 scale-125' : 'bg-gray-300 hover:bg-gray-500'
                                }`}
                        />
                        {currentSlide === index && (
                            <motion.div
                                layoutId="activeDot"
                                className="absolute -inset-1 border border-black rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

        </section>
    );
}
