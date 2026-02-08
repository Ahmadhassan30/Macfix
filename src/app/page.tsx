'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import HeroAnimation from '@/components/ChipScroll';
import DockHeader from '@/components/DockHeader';
import MacBookScroll from '@/components/MacBookScroll';

const MagneticButton = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((clientX - centerX) * 0.3); // Magnetic strength
        y.set((clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: mouseXSpring, y: mouseYSpring }}
            className={className}
        >
            {children}
        </motion.button>
    );
};

export default function Home() {
    return (
        <main className="bg-black text-white overflow-x-hidden selection:bg-white selection:text-black">

            {/* FLOATING DOCK NAV */}
            <DockHeader />

            {/* 1. HERO SECTION (Untouched) */}
            <HeroAnimation />

            {/* 2. BOLD MANIFESTO SECTION */}
            <motion.section
                className="relative min-h-screen flex items-center justify-center py-20 md:py-40 px-6 pt-20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <div className="container mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[12vw] md:text-[10vw] leading-[0.8] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-700 mix-blend-difference"
                    >
                        PRECISION<br />
                        IS OUR<br />
                        RELIGION
                    </motion.h2>
                    <div className="mt-12 md:mt-24 flex justify-start md:justify-end">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="text-xl md:text-3xl font-light text-neutral-400 max-w-2xl leading-relaxed tracking-tight"
                        >
                            We don&apos;t just fix devices. We resurrect technology. <br />
                            Every screw tuned. Every pixel perfect. <br />
                            <span className="text-white">The gold standard in MacBook restoration.</span>
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            {/* 3. SERVICE LIST - TYPOGRAPHIC LAYOUT */}
            <section className="py-20 md:py-40 border-t border-neutral-900">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col">
                        {[
                            { id: "01", title: "SCREEN REPLACEMENT", desc: "Original Retina displays. calibrated." },
                            { id: "02", title: "LOGIC BOARD REPAIR", desc: "Micro-soldering at component level." },
                            { id: "03", title: "BATTERY SERVICE", desc: "Zero-cycle cells. Factory sealed." },
                            { id: "04", title: "LIQUID DAMAGE", desc: "Ultrasonic cleaning & trace repair." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scaleY: 0 }}
                                whileInView={{ opacity: 1, scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="group border-b border-neutral-800 py-8 md:py-16 flex flex-col md:flex-row md:items-baseline justify-between cursor-pointer origin-top hover:bg-neutral-900/30 transition-colors px-4"
                            >
                                <span className="text-xs md:text-sm font-mono text-neutral-500 mb-2 md:mb-0">({item.id})</span>
                                <h3 className="text-3xl md:text-7xl lg:text-8xl font-bold tracking-tighter group-hover:translate-x-4 transition-transform duration-500">{item.title}</h3>
                                <p className="text-neutral-400 font-light mt-2 md:mt-0 text-sm md:text-base max-w-xs md:text-right group-hover:text-white transition-colors">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. IMMERSIVE STATS SPEED SECTION */}
            <section className="relative min-h-[60vh] md:h-[80vh] flex items-center bg-white text-black overflow-hidden py-20 md:py-0">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="mb-10 md:mb-20"
                            >
                                <span className="block text-xs md:text-sm font-mono tracking-widest uppercase mb-2">Success Rate</span>
                                <h2 className="text-[20vw] md:text-[12rem] leading-none font-bold tracking-tighter">99.8%</h2>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <span className="block text-xs md:text-sm font-mono tracking-widest uppercase mb-2">Turnaround</span>
                                <h2 className="text-[20vw] md:text-[12rem] leading-none font-bold tracking-tighter text-neutral-400">24H</h2>
                            </motion.div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-3xl md:text-5xl font-medium leading-tight tracking-tight">
                                Efficiency is our currency. <br />
                                We understand that your workflow stops when your Mac stops.
                            </p>
                            <div className="mt-8 md:mt-12 h-1 w-full bg-neutral-200 overflow-hidden">
                                <motion.div
                                    className="h-full bg-black"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />
            </section>

            {/* 5. PROCESS MARQUEE */}
            <section className="py-20 md:py-32 overflow-hidden bg-black border-b border-neutral-900">
                <div className="whitespace-nowrap flex">
                    <motion.div
                        animate={{ x: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="flex gap-8 md:gap-16 text-[15vw] md:text-[10vw] font-bold text-neutral-800 tracking-tighter"
                    >
                        <span>DIAGNOSE</span>
                        <span className="text-white">REPAIR</span>
                        <span>QUALITY CHECK</span>
                        <span>DELIVER</span>
                        <span>DIAGNOSE</span>
                        <span className="text-white">REPAIR</span>
                        <span>QUALITY CHECK</span>
                        <span>DELIVER</span>
                    </motion.div>
                </div>
            </section>

            {/* 6. MINIMALIST CTA */}
            <section className="h-[70vh] md:h-screen flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-4xl md:text-[5vw] font-medium tracking-tight mb-8 md:mb-12">Ready to revive your machine?</h2>

                <MagneticButton className="group relative inline-flex items-center justify-center px-10 py-4 bg-white text-black rounded-full overflow-hidden transition-all duration-300 hover:scale-105">
                    <Link href="/book">
                        <span className="relative z-10 text-lg font-bold tracking-tight group-hover:text-black transition-colors">START REPAIR</span>
                    </Link>
                    <div className="absolute inset-0 bg-neutral-200 scale-0 group-hover:scale-100 transition-transform origin-center duration-500 rounded-full" />
                </MagneticButton>

                <div className="mt-12 md:mt-24 flex flex-col md:flex-row md:justify-between items-center md:w-full max-w-4xl text-xs md:text-sm font-mono text-neutral-500 uppercase tracking-widest gap-4 md:gap-0">
                    <span>Lahore, Pakistan</span>
                    <span>est. 2025</span>
                    <span>Authorized Provider</span>
                </div>
            </section>

            {/* QUICK ACTIONS SECTION */}
            <section className="py-20 md:py-40 border-y border-neutral-900">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-16 md:mb-32"
                    >
                        <h2 className="text-[12vw] md:text-[6vw] leading-[0.9] font-bold tracking-tighter text-white overflow-hidden">
                            {"GET STARTED".split('').map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: "100%" }}
                                    whileInView={{ y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.5, delay: i * 0.02 }}
                                    className="inline-block"
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </h2>
                        <div className="overflow-hidden mt-4 md:mt-8">
                            <motion.p
                                initial={{ y: "100%", opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ ease: "easeOut", duration: 1, delay: 0.4 }}
                                className="text-lg md:text-2xl font-light text-neutral-500 max-w-2xl tracking-tight"
                            >
                                Book a repair, track your device, or browse our premium accessories
                            </motion.p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-0">
                        {[
                            { id: "01", title: "Book Repair", description: "Schedule a collection or drop-off", href: "/book" },
                            { id: "02", title: "Track Device", description: "Real-time status updates", href: "/track" },
                            { id: "03", title: "Accessories", description: "Premium components & protection", href: "/products" }
                        ].map((action, index) => (
                            <Link href={action.href} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group border-b border-neutral-800 py-8 md:py-16 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-neutral-900/20 transition-all duration-500 px-2 md:px-4"
                                >
                                    <div className="flex items-baseline gap-4 md:gap-12">
                                        <span className="text-xs md:text-sm font-mono text-neutral-600 group-hover:text-white transition-colors duration-500">({action.id})</span>
                                        <div className="relative overflow-hidden">
                                            <h3 className="text-4xl md:text-7xl font-bold tracking-tighter text-neutral-300 group-hover:text-white transition-colors duration-500">
                                                {action.title}
                                            </h3>
                                            <div className="absolute top-0 left-0 w-full h-full bg-white mix-blend-difference transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                                        <p className="text-neutral-500 font-light text-sm md:text-base max-w-[200px] text-right hidden md:block group-hover:text-neutral-300 transition-colors duration-500">
                                            {action.description}
                                        </p>
                                        <motion.span
                                            className="text-2xl md:text-4xl text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hidden md:block" // Hidden arrow on mobile to prevent layout weirdness or show simpler
                                        >
                                            →
                                        </motion.span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. MACBOOK SCROLL ANIMATION */}
            <MacBookScroll />

            {/* FOOTER */}
            <footer className="relative z-30 bg-black py-20 border-t border-neutral-900 flex flex-col items-center justify-center">
                <h1 className="text-[15vw] font-black tracking-tighter leading-none text-neutral-900 select-none mb-16 md:mb-0">MACFIX PRO</h1>

                <div className="w-full px-6 flex flex-col md:flex-row justify-between items-center gap-6 md:absolute md:bottom-8 md:left-0 md:px-8">
                    <div className="text-[10px] md:text-xs font-mono text-neutral-500 tracking-widest uppercase opacity-80 text-center">
                        © {new Date().getFullYear()} MacFix. All Rights Reserved.
                    </div>

                    <a
                        href="https://ahmadhassan.engineer/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] md:text-xs font-mono text-neutral-400 hover:text-white transition-colors tracking-widest uppercase opacity-80 hover:opacity-100 text-center"
                    >
                        Design & Code by Ahmad Hassan
                    </a>
                </div>
            </footer>
        </main>
    );
}
