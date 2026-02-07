'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function DockHeader() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Only resize AFTER the hero animation is mostly done (approx 2500px)
        const scrolled = latest > 2500;
        if (scrolled !== isScrolled) {
            setIsScrolled(scrolled);
        }
    });

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center px-4 pointer-events-none">
            <motion.div
                layout
                initial={{ y: -50, opacity: 0, width: "700px" }}
                animate={{
                    y: 0,
                    opacity: 1,
                    width: isScrolled ? "auto" : "700px",
                    borderRadius: "9999px"
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`pointer-events-auto relative flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden`}
                style={{
                    height: isScrolled ? 50 : 64,
                }}
            >
                {/* Glass Shim */}
                <div className="absolute inset-0 bg-white/5 pointer-events-none" />

                {/* 1. LEFT: LOGO */}
                <motion.div
                    layout
                    className={`flex items-center gap-3 pl-6 pr-2 h-full ${isScrolled ? 'pl-4' : 'pl-8'}`}
                >
                    <Image
                        src="/icon.png"
                        alt="MacFix Logo"
                        width={isScrolled ? 32 : 40}
                        height={isScrolled ? 32 : 40}
                        className="transition-all duration-300"
                        priority
                    />
                </motion.div>

                {/* 2. CENTER: LINKS */}
                <nav className="flex items-center gap-1 md:gap-2 px-4">
                    {['Services', 'Process', 'Labs'].map((item) => (
                        <NavLink key={item} label={item} compact={isScrolled} />
                    ))}
                </nav>

                {/* 3. RIGHT: CTA */}
                <motion.div
                    layout
                    className={`flex items-center h-full pr-2 ${isScrolled ? 'mr-1' : 'mr-2'}`}
                >
                    <motion.button
                        layout
                        whileHover={{ scale: 1.05, backgroundColor: "#fff" }}
                        whileTap={{ scale: 0.95 }}
                        className={`bg-white text-black font-bold tracking-tight rounded-full transition-colors flex items-center justify-center whitespace-nowrap ${isScrolled ? 'h-8 px-4 text-xs' : 'h-10 px-6 text-sm'
                            }`}
                    >
                        <AnimatePresence mode='wait'>
                            {isScrolled ? (
                                <motion.span key="book" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    BOOK
                                </motion.span>
                            ) : (
                                <motion.span key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    START REPAIR
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
}

const NavLink = ({ label, compact }: { label: string, compact: boolean }) => (
    <motion.a
        href="#"
        className={`relative font-medium tracking-tight text-white/60 hover:text-white transition-colors uppercase ${compact ? 'text-[10px] px-2' : 'text-xs px-4'
            }`}
    >
        {label}
        {/* Active Dot Effect */}
        {!compact && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 hover:opacity-100 transition-opacity" />
        )}
    </motion.a>
);
