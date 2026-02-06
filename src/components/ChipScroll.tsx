'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// NEW IMAGE CONFIGURATION
const TOTAL_FRAMES = 192;
const FRAME_PATH = '/sequences/frame_'; // Updated path
const FRAME_EXTENSION = '.png';         // Updated extension
const FRAME_PADDING = 5;                // 5 digits: 00001, 00002, etc.
const SCROLL_DISTANCE = 3000;           // Adjusted for 192 frames

export default function HeroAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [animationComplete, setAnimationComplete] = useState(false);

    // Optimized Loading Strategy
    useEffect(() => {
        let isMounted = true;

        // Priority: Load first frame immediately to unlock UI
        const loadFirstFrame = async () => {
            const img = new Image();
            const frameNumber = '00001';
            img.src = `${FRAME_PATH}${frameNumber}${FRAME_EXTENSION}`;

            await new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve(); // Proceed even if error
            });

            if (isMounted) {
                setImages(prev => {
                    const newImages = [...prev];
                    newImages[0] = img;
                    return newImages;
                });
                setImagesLoaded(true); // UNLOCK UI IMMEDIATELY
            }
        };

        // Background: Load the rest
        const loadRemainingFrames = async () => {
            const loadedImages: HTMLImageElement[] = [];
            // Initialize array
            for (let i = 0; i < TOTAL_FRAMES; i++) loadedImages[i] = new Image();

            let loadedCount = 0;

            for (let i = 0; i < TOTAL_FRAMES; i++) {
                if (!isMounted) break;
                if (i === 0) continue; // Skip first (already doing it)

                const img = new Image();
                const frameNumber = String(i + 1).padStart(FRAME_PADDING, '0');
                img.src = `${FRAME_PATH}${frameNumber}${FRAME_EXTENSION}`;

                img.onload = () => {
                    if (!isMounted) return;
                    setImages(prev => {
                        const next = [...prev];
                        next[i] = img;
                        return next;
                    });
                };
            }
        };

        loadFirstFrame().then(() => loadRemainingFrames());

        return () => { isMounted = false; };
    }, []);

    // Handle scroll - map scroll position to frame
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (scrollY <= SCROLL_DISTANCE) {
                // Calculate frame based on scroll position
                const progress = scrollY / SCROLL_DISTANCE;
                const frame = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);
                setCurrentFrame(frame);
                setAnimationComplete(false);
            } else {
                // Animation is complete
                setCurrentFrame(TOTAL_FRAMES - 1);
                setAnimationComplete(true);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Draw logic with Fallback
    useEffect(() => {
        // Find the best available frame
        let frameToDraw = currentFrame;

        // If current frame isn't loaded, fallback to nearest previous loaded frame
        if (!images[frameToDraw] || !images[frameToDraw].complete) {
            // Search backwards for a loaded frame
            for (let i = currentFrame; i >= 0; i--) {
                if (images[i] && images[i].complete && images[i].naturalWidth > 0) {
                    frameToDraw = i;
                    break;
                }
            }
        }

        const img = images[frameToDraw];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Set canvas size
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // Only resize if necessary (performance)
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
        }

        // Contain fit
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;

        let drawW, drawH, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
            drawW = canvas.width;
            drawH = canvas.width / imgRatio;
        } else {
            drawH = canvas.height;
            drawW = canvas.height * imgRatio;
        }

        offsetX = (canvas.width - drawW) / 2;
        offsetY = (canvas.height - drawH) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    }, [currentFrame, images]); // Removed imagesLoaded dependency
    // Handle resize
    useEffect(() => {
        const handleResize = () => setCurrentFrame(prev => prev);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* Loading Screen */}
            {!imagesLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="w-10 h-10 mx-auto mb-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-3">Loading</p>
                        <div className="w-40 h-[2px] bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white"
                                initial={{ width: 0 }}
                                animate={{ width: `${loadProgress}%` }}
                            />
                        </div>
                        <p className="mt-2 text-white/20 text-xs font-mono">{loadProgress}%</p>
                    </motion.div>
                </div>
            )}

            {/* FIXED HERO - Stays in place while scrolling */}
            <div
                className={`${animationComplete ? 'relative' : 'fixed'} inset-0 w-full h-screen z-40`}
                style={{
                    background: 'linear-gradient(to bottom, #87CEFA 0%, #1E90FF 25%, #000000 60%)' // Horizon Blue Gradient
                }}
            >
                {/* 1. LAYER ONE: HERO TEXT (Behind Laptop) */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-0"
                    animate={{ opacity: currentFrame < 20 ? 1 : 0, scale: currentFrame < 20 ? 1 : 0.95 }}
                    transition={{ duration: 0.8 }}
                >
                    {imagesLoaded && (
                        <>
                            <motion.h1
                                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[18vw] font-black tracking-tighter leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-blue-900 to-black mix-blend-overlay opacity-50"
                                style={{ filter: 'blur(0px)' }}
                            >
                                MACFIX<br />PRO
                            </motion.h1>
                        </>
                    )}
                </motion.div>

                {/* 2. LAYER TWO: LAPTOP (Middle) */}
                <div className="w-full h-full flex items-center justify-center pointer-events-none relative z-10">
                    <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full object-contain drop-shadow-2xl bg-transparent mix-blend-screen"
                        />
                    </div>
                </div>

                {/* 3. LAYER THREE: OVERLAYS (Front) */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-start justify-center pointer-events-none px-6 md:px-20 z-20"
                    animate={{ opacity: currentFrame >= 60 && currentFrame < 130 ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-[10vw] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20 tracking-tighter leading-none">
                        INSIDE<br />
                        OUT.
                    </h2>
                </motion.div>

                <motion.div
                    className="absolute inset-0 flex flex-col items-end justify-center text-right pointer-events-none px-6 md:px-20 z-20"
                    animate={{ opacity: currentFrame >= 175 ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-[10vw] font-bold text-white tracking-tighter leading-none mix-blend-difference">
                        BORN<br />
                        NEW.
                    </h2>
                </motion.div>

                {/* Minimal Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                    animate={{ opacity: currentFrame < 10 ? 1 : 0 }}
                >
                    <div className="h-12 w-[1px] bg-white/20 overflow-hidden">
                        <motion.div
                            className="w-full h-full bg-white"
                            animate={{ y: [-50, 50] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                    </div>
                </motion.div>

            </div>

            {/* SPACER - Creates scroll distance for the animation */}
            <div style={{ height: `${SCROLL_DISTANCE}px` }} className="bg-black" />
        </>
    );
}
