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
                className="relative min-h-screen flex items-center justify-center py-40 px-6 pt-20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="max-w-[1600px] mx-auto w-full">
                    <motion.h2
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[12vw] leading-[0.8] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-700 mix-blend-difference"
                    >
                        PRECISION<br />
                        IS OUR<br />
                        PROMISE.
                    </motion.h2>
                    <div className="mt-24 flex justify-end">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="text-2xl md:text-3xl font-light text-neutral-400 max-w-2xl leading-relaxed tracking-tight"
                        >
                            We don&apos;t just fix devices. We resurrect technology. <br />
                            Every screw tuned. Every pixel perfect. <br />
                            <span className="text-white">The gold standard in MacBook restoration.</span>
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            {/* 3. SERVICE LIST - TYPOGRAPHIC LAYOUT */}
            <section className="py-40 border-t border-neutral-900">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col">
                        {[
                            { id: "01", title: "SCREEN REPLACEMENT", desc: "Original Retina displays. calibrated." },
                            { id: "02", title: "LOGIC BOARD REPAIR", desc: "Component-level microsoldering." },
                            { id: "03", title: "DATA RECOVERY", desc: "Forensic-grade extraction." },
                            { id: "04", title: "BATTERY RESTORATION", desc: "Zero-cycle OEM cells." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scaleY: 0 }}
                                whileInView={{ opacity: 1, scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="group border-b border-neutral-800 py-16 flex flex-col md:flex-row md:items-baseline justify-between cursor-pointer origin-top hover:bg-neutral-900/30 transition-colors px-4"
                            >
                                <span className="text-sm font-mono text-neutral-500 mb-4 md:mb-0">({item.id})</span>
                                <h3 className="text-5xl md:text-8xl font-bold tracking-tighter group-hover:translate-x-4 transition-transform duration-500">{item.title}</h3>
                                <p className="text-neutral-400 font-light mt-4 md:mt-0 max-w-xs text-right group-hover:text-white transition-colors">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. IMMERSIVE STATS SPEED SECTION */}
            <section className="relative h-[80vh] flex items-center bg-white text-black overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="mb-20"
                            >
                                <span className="block text-sm font-mono tracking-widest uppercase mb-2">Success Rate</span>
                                <h2 className="text-[12rem] leading-none font-bold tracking-tighter">99.8%</h2>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <span className="block text-sm font-mono tracking-widest uppercase mb-2">Turnaround</span>
                                <h2 className="text-[12rem] leading-none font-bold tracking-tighter text-neutral-400">24H</h2>
                            </motion.div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-5xl font-medium leading-tight tracking-tight">
                                Efficiency is our currency. <br />
                                We understand that your workflow stops when your Mac stops.
                            </p>
                            <div className="mt-12 h-1 w-full bg-neutral-200 overflow-hidden">
                                <motion.div
                                    className="h-full bg-black"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. PROCESS MARQUEE */}
            <section className="py-32 overflow-hidden bg-black border-b border-neutral-900">
                <div className="whitespace-nowrap flex">
                    <motion.div
                        animate={{ x: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="flex gap-16 text-[10vw] font-bold text-neutral-800 tracking-tighter"
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
            <section className="h-screen flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-[5vw] font-medium tracking-tight mb-12">Ready to revive your machine?</h2>

                <MagneticButton className="group relative inline-flex items-center justify-center px-10 py-4 bg-white text-black rounded-full overflow-hidden transition-all duration-300 hover:scale-105">
                    <Link href="/book">
                        <span className="relative z-10 text-lg font-bold tracking-tight group-hover:text-black transition-colors">START REPAIR</span>
                    </Link>
                    <div className="absolute inset-0 bg-neutral-200 scale-0 group-hover:scale-100 transition-transform origin-center duration-500 rounded-full" />
                </MagneticButton>

                <div className="mt-24 flex justify-between w-full max-w-4xl text-sm font-mono text-neutral-500 uppercase tracking-widest">
                    <span>Lahore, Pakistan</span>
                    <span>est. 2025</span>
                    <span>Authorized Provider</span>
                </div>
            </section>

            {/* QUICK ACTIONS SECTION */}
            <section className="py-40 border-y border-neutral-900">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-32"
                    >
                        <h2 className="text-[8vw] md:text-[6vw] leading-[0.9] font-bold tracking-tighter text-white overflow-hidden">
                            {"GET STARTED".split('').map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: "100%" }}
                                    whileInView={{ y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.8, delay: i * 0.05 }}
                                    className="inline-block"
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </h2>
                        <div className="overflow-hidden mt-8">
                            <motion.p
                                initial={{ y: "100%", opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ ease: "easeOut", duration: 1, delay: 0.4 }}
                                className="text-xl md:text-2xl font-light text-neutral-500 max-w-2xl tracking-tight"
                            >
                                Book a repair, track your device, or browse our premium accessories
                            </motion.p>
                        </div>
                    </motion.div>

                    <div className="flex flex-col">
                        {[
                            {
                                id: "01",
                                title: 'BOOK REPAIR',
                                description: 'Schedule your MacBook repair service with our expert technicians',
                                href: '/book'
                            },
                            {
                                id: "02",
                                title: 'TRACK STATUS',
                                description: 'Check the real-time status of your device repair',
                                href: '/track'
                            },
                            {
                                id: "03",
                                title: 'SHOP PARTS',
                                description: 'Browse genuine Apple parts and premium accessories',
                                href: '/products'
                            }
                        ].map((action, index) => (
                            <Link key={index} href={action.href}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group border-b border-neutral-800 py-12 md:py-16 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-neutral-900/20 transition-all duration-500 px-2 md:px-4"
                                >
                                    <div className="flex items-baseline gap-6 md:gap-12">
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
                                            className="text-2xl md:text-4xl text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
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
            <footer className="relative py-12 border-t border-neutral-900 text-center">
                <h1 className="text-[15vw] font-black tracking-tighter leading-none text-neutral-900 select-none">MACFIX PRO</h1>

                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-[10px] md:text-xs font-mono text-neutral-500 tracking-widest uppercase opacity-80">
                    © {new Date().getFullYear()} MacFix. All Rights Reserved.
                </div>

                <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
                    <a
                        href="https://ahmadhassan.engineer/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] md:text-xs font-mono text-neutral-400 hover:text-white transition-colors tracking-widest uppercase opacity-80 hover:opacity-100"
                    >
                        Design & Code by Ahmad Hassan
                    </a>
                </div>
            </footer>
        </main>
    );
}
