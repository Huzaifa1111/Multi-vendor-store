"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

export default function WatchHero() {
    const router = useRouter()
    const containerRef = useRef(null)
    const [time, setTime] = useState(new Date())

    // Scroll-linked animation logic
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    // Create a smoothed progress value using physics (Inertia)
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    // Physics-based sequential logic: Immersive Background Worlds
    const mainWatchOpacity = useTransform(smoothProgress, [0, 0.35, 0.55], [1, 1, 0])
    const mainWatchScale = useTransform(smoothProgress, [0, 0.45], [1.1, 1]) // Subtle zoom out

    // Rolex Background Overlay: Fills the entire slider
    const rolexOpacity = useTransform(smoothProgress, [0.45, 0.65, 0.9, 1], [0, 1, 1, 0.9])
    const rolexScale = useTransform(smoothProgress, [0.45, 0.8], [1.1, 1])

    // Text Transition: Immersive Overlay (Phase 1 & Phase 2)
    const textPhase1Opacity = useTransform(smoothProgress, [0, 0.35], [1, 0])
    const textPhase1Scale = useTransform(smoothProgress, [0, 0.35], [1, 0.95])

    const textPhase2Opacity = useTransform(smoothProgress, [0.6, 0.85], [0, 1])
    const textPhase2Scale = useTransform(smoothProgress, [0.6, 0.85], [0.95, 1])
    const textPhase2Y = useTransform(smoothProgress, [0.6, 0.85], [20, 0])

    // Real-time watch hand movement
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Physics-based mouse parallax (Only during Phase 1)
    const mouseX = useSpring(0, { stiffness: 50, damping: 20 })
    const mouseY = useSpring(0, { stiffness: 50, damping: 20 })

    const handleMouseMove = (e: React.MouseEvent) => {
        if (smoothProgress.get() > 0.4) return
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        const x = (clientX / innerWidth - 0.5) * 30
        const y = (clientY / innerHeight - 0.5) * 30
        mouseX.set(x)
        mouseY.set(y)
    }

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative h-[120vh] w-full bg-[#0a0a0a] font-plus-jakarta-sans overflow-hidden"
        >
            <div className="sticky top-0 h-screen w-full flex items-center justify-center">

                {/* Subtle Background Gradient */}
                <div className="absolute inset-0 bg-radial-gradient from-emerald-950/20 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 relative h-full w-full flex items-center justify-center">

                    {/* PHASE 1: Full-Cover Premiere (Cinematic Background) */}
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10 overflow-hidden">

                        {/* THE BACKGROUND */}
                        <motion.div
                            style={{
                                opacity: mainWatchOpacity,
                                scale: mainWatchScale,
                                x: mouseX,
                                y: mouseY
                            }}
                            className="absolute inset-0 w-full h-full z-0"
                        >
                            <Image
                                src="/Watch1.jpg"
                                alt="Cinematic Premiere Background"
                                fill
                                className="object-cover mix-blend-screen opacity-60 brightness-[0.7]"
                                priority
                            />
                        </motion.div>

                        {/* THE TEXT (Overlayed prominently) */}
                        <motion.div
                            style={{
                                opacity: textPhase1Opacity,
                                scale: textPhase1Scale
                            }}
                            className="relative flex flex-col items-center text-center max-w-4xl px-6 pointer-events-none z-10"
                        >
                            <span className="text-emerald-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-8">
                                Grand Premiere
                            </span>
                            <h1 className="text-white text-4xl md:text-[6rem] font-black tracking-tighter leading-[0.8] mb-12 drop-shadow-2xl">
                                PURE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">
                                    MASTERY.
                                </span>
                            </h1>
                            <p className="text-white/40 max-w-2xl font-medium leading-relaxed uppercase tracking-[0.3em] text-[10px] md:text-[11px]">
                                The ultimate expression of horological art.
                            </p>
                        </motion.div>
                    </div>


                    {/* PHASE 2: Full-Cover Rolex Reveal (Matched Immersive Scene) */}
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center z-20 overflow-hidden">

                        {/* THE BACKGROUND (Fully Covering the Slider) */}
                        <motion.div
                            style={{
                                opacity: rolexOpacity,
                                scale: rolexScale,
                            }}
                            className="absolute inset-0 w-full h-full z-0"
                        >
                            <Image
                                src="/rolex.jpg"
                                alt="Legendary Rolex Background"
                                fill
                                className="object-cover mix-blend-screen opacity-40 grayscale-[20%] brightness-[0.6]"
                            />
                        </motion.div>

                        {/* THE TEXT (Overlayed prominently) */}
                        <motion.div
                            style={{
                                opacity: textPhase2Opacity,
                                scale: textPhase2Scale,
                                y: textPhase2Y
                            }}
                            className="relative flex flex-col items-center text-center max-w-4xl px-6 pointer-events-auto z-10"
                        >
                            <span className="text-emerald-400 font-black uppercase tracking-[0.6em] text-[10px] mb-8 shadow-sm">
                                The Crown Collection
                            </span>
                            <h2 className="text-white text-4xl md:text-[6rem] font-black tracking-tighter leading-[0.8] mb-12 drop-shadow-2xl">
                                TIMELESS <br />
                                <span className="text-emerald-500 underline decoration-emerald-500/20 underline-offset-[1.5rem]">LEGACY.</span>
                            </h2>

                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push("/products")}
                                className="px-16 py-6 border-2 border-white/20 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-none mb-16 transition-all hover:border-white shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
                            >
                                View Collection
                            </motion.button>

                            <div className="flex gap-20 text-white/30 font-black uppercase tracking-widest text-[9px]">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-[1px] w-12 bg-emerald-500/40" />
                                    Elite Standard
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-[1px] w-12 bg-emerald-500/40" />
                                    Eternal Craft
                                </div>
                            </div>
                        </motion.div>

                    </div>


                </div>

                {/* Side Label */}
                <div className="absolute right-12 bottom-24 vertical-lr hidden md:block">
                    <motion.span
                        style={{ opacity: textPhase2Opacity }}
                        className="text-white/5 text-[8rem] font-black select-none tracking-tighter"
                    >
                        ROLEX
                    </motion.span>
                </div>

                {/* Bottom Decorative Label */}
                <div className="absolute bottom-12 left-0 w-full z-20">
                    <motion.div
                        style={{ opacity: textPhase1Opacity }}
                        className="container mx-auto px-6 flex justify-start gap-12 text-white/20 text-[10px] uppercase tracking-[0.5em] font-bold"
                    >
                        ESTABLISHED 2026 • HAND-CRAFTED • LIMITED EDITION
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
