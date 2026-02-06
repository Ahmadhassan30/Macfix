'use client';

import { motion } from 'framer-motion';

const NavLink = ({ label }: { label: string }) => (
    <motion.a
        href="#"
        className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        {label}
        {/* Hover underlining effect could go here if desired */}
    </motion.a>
);

export default function DockHeader() {
    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between h-16 pl-6 pr-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full shadow-2xl"
            >
                {/* 1. LOGO */}
                <div className="flex items-center gap-2 mr-8">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        {/* Simple abstract apple-like or chip shape */}
                        <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5 10 5 10-5-5-2.5-5 2.5z" />
                    </svg>
                    <span className="font-bold tracking-tight text-white hidden sm:block">MacFix</span>
                </div>

                {/* 2. CENTER NAV LINKS */}
                <nav className="hidden md:flex items-center gap-2">
                    {['Services', 'Process', 'Reviews', 'Support'].map((item) => (
                        <NavLink key={item} label={item} />
                    ))}
                </nav>

                {/* 3. RIGHT CTA BUTTON */}
                <div className="ml-auto flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: '#ffffff' }}
                        whileTap={{ scale: 0.98 }}
                        className="h-12 px-6 bg-white/90 hover:bg-white text-black text-sm font-semibold rounded-full transition-colors hidden sm:block"
                    >
                        Book Repair
                    </motion.button>
                    {/* Mobile Menu Icon Placeholder for small screens */}
                    <button className="sm:hidden p-2 text-white/80">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
