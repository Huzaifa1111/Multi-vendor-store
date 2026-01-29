"use client"

import Hyperspeed from "@/components/Hyperspeed"
import { hyperspeedPresets } from "@/lib/hyperspeedPresets"
import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HeroSection() {
    const [isHyper, setIsHyper] = useState(false)
    const [isExiting, setIsExiting] = useState(false)
    const router = useRouter()

    const handleExplore = () => {
        setIsHyper(true)
        setIsExiting(true)

        // Smooth transition: cinematic speedup for 1.2s before navigating
        setTimeout(() => {
            router.push("/products")
        }, 1200)
    }

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black font-plus-jakarta-sans">
            <div className="absolute inset-0 z-0">
                <Hyperspeed effectOptions={hyperspeedPresets.one} isHyper={isHyper} />
            </div>

            {/* Reduced overlay opacity for better background visibility */}
            <div className={`absolute inset-0 bg-black/20 z-10 transition-opacity duration-1000 ${isHyper ? 'opacity-0' : 'opacity-100'}`} />

            {/* Content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.2 : 1, y: isExiting ? -20 : 0 }}
                    transition={{ duration: 0.8, ease: "anticipate" }}
                    className="text-white text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tighter leading-none"
                >
                    New Season Drop
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -10 : 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-white/80 mt-6 max-w-xl text-lg md:text-xl font-medium tracking-wide"
                >
                    Experience motion-driven design with cinematic visuals.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? 20 : 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <button
                        onClick={handleExplore}
                        disabled={isExiting}
                        className="mt-10 px-10 py-5 bg-white text-black font-extrabold uppercase tracking-widest text-sm rounded-full hover:scale-105 transition-all active:scale-95 shadow-2xl disabled:opacity-0"
                    >
                        Explore Collection
                    </button>
                </motion.div>
            </div>
        </section>
    )
}
