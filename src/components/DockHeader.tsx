'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

const DockItem = ({ mouseX, label }: { mouseX: any, label: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className="aspect-square rounded-full bg-neutral-800/80 border border-white/10 flex items-center justify-center relative group cursor-pointer hover:bg-white transition-colors duration-300"
        >
            <span className="text-[10px] font-bold text-white group-hover:text-black absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {label.substring(0, 2).toUpperCase()}
            </span>
            {/* Tooltip */}
            <span className="absolute -top-10 text-xs bg-white text-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {label}
            </span>
        </motion.div>
    );
};

export default function DockHeader() {
    const mouseX = useMotionValue(Infinity);

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className="flex items-start h-16 gap-4 px-4 pt-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl"
            >
                {['Home', 'Services', 'Process', 'Labs', 'Contact'].map((item) => (
                    <DockItem key={item} mouseX={mouseX} label={item} />
                ))}
            </motion.div>
        </div>
    );
}
