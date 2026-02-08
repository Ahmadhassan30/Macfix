'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScrolling() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5, // Increased from 1.2 for more float/glide
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.8, // Slightly lower for more control
            touchMultiplier: 1.5, // Natural feel on touch
            infinite: false,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return null;
}
