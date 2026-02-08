'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function DockHeader() {
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center w-full pointer-events-none">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto bg-[#050505]/80 backdrop-blur-2xl border border-white/10 rounded-full px-2 p-2 flex items-center gap-2 shadow-2xl"
                onMouseLeave={() => setHoveredNav(null)}
            >
                {/* LOGO (Text Only) */}
                <Link href="/" className="px-6 py-2 group relative overflow-hidden rounded-full hover:bg-white/5 transition-colors">
                    <span className="relative z-10 font-bold tracking-tighter text-lg text-white group-hover:text-neutral-200 transition-colors">
                        MACFIX
                    </span>
                </Link>

                {/* DIVIDER */}
                <div className="w-[1px] h-4 bg-white/10" />

                {/* NAV ITEMS */}
                <div className="flex items-center">
                    <NavItem
                        label="REPAIR"
                        href="/book"
                        onMouseEnter={() => setHoveredNav('repair')}
                        isActive={hoveredNav === 'repair'}
                    >
                        {/* DROPDOWN */}
                        <AnimatePresence>
                            {hoveredNav === 'repair' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[260px] bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden"
                                >
                                    <div className="flex flex-col gap-1">
                                        {[
                                            "Screen Replacement",
                                            "Logic Board Repair",
                                            "Battery Replacement",
                                            "Liquid Damage",
                                            "Data Recovery"
                                        ].map((item, i) => (
                                            <motion.div
                                                key={item}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <Link
                                                    href="/book"
                                                    className="block px-4 py-3 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium tracking-tight"
                                                >
                                                    {item}
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </NavItem>

                    <NavItem label="TRACK" href="/track" />
                    <NavItem label="STORE" href="/products" />
                </div>

                {/* CTA BUTTON */}
                <Link href="/book" className="ml-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold tracking-tight hover:bg-neutral-200 transition-colors"
                    >
                        START REPAIR
                    </motion.button>
                </Link>
            </motion.nav>
        </div>
    );
}

const NavItem = ({ label, href, children, onMouseEnter, isActive }: any) => (
    <div
        className="relative group px-1"
        onMouseEnter={onMouseEnter}
    >
        <Link
            href={href}
            className={`relative z-10 block px-5 py-2.5 rounded-full text-xs font-mono tracking-widest transition-all duration-300 ${isActive ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
        >
            {label}
        </Link>
        {children}
    </div>
);
