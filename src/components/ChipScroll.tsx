'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TOTAL_FRAMES = 240;
const FRAME_PATH = '/sequence/ezgif-frame-';
const SCROLL_DISTANCE = 2500; // pixels of scrolling to complete animation

export default function HeroAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [animationComplete, setAnimationComplete] = useState(false);

    // Preload all images
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        const loadImage = (index: number) => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                const frameNumber = String(index + 1).padStart(3, '0');
                img.src = `${FRAME_PATH}${frameNumber}.jpg`;

                img.onload = () => {
                    loadedImages[index] = img;
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                    resolve();
                };

                img.onerror = () => {
                    loadedImages[index] = new Image();
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                    resolve();
                };
            });
        };

        Promise.all(Array.from({ length: TOTAL_FRAMES }, (_, i) => loadImage(i)))
            .then(() => {
                setImages(loadedImages);
                setImagesLoaded(true);
            });
    }, []);

    // Handle scroll - map scroll position to frame
    useEffect(() => {
        if (!imagesLoaded) return;

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
    }, [imagesLoaded]);

    // Draw current frame to canvas
    useEffect(() => {
        if (!imagesLoaded || images.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const img = images[currentFrame];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        // Set canvas size
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

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

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    }, [currentFrame, imagesLoaded, images]);

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

            {/* 
                FIXED HERO - Stays in place while scrolling
                Only moves away after animation is complete
            */}
            <div
                className={`${animationComplete ? 'relative' : 'fixed'} inset-0 w-full h-screen bg-black z-40`}
            >
                {/* Canvas Container */}
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-full h-full max-w-5xl max-h-[80vh] px-4 flex items-center justify-center">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full"
                        />
                    </div>
                </div>

                {/* Hero Text - Visible at start */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6"
                    animate={{ opacity: currentFrame < 20 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {imagesLoaded && (
                        <>
                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-white/40 text-xs uppercase tracking-[0.4em] mb-3"
                            >
                                Expert MacBook Repairs
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
                                style={{ textShadow: '0 4px 40px rgba(0,0,0,0.9)' }}
                            >
                                MacFix Pro
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-4 text-white/50 text-sm md:text-base max-w-md"
                            >
                                Precision repairs, component by component.
                            </motion.p>
                        </>
                    )}
                </motion.div>

                {/* Mid Text */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-start justify-center pointer-events-none px-8 md:px-16"
                    animate={{ opacity: currentFrame >= 80 && currentFrame < 160 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl md:text-4xl font-bold text-white" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.9)' }}>
                        Every Component.<br />Inspected.
                    </h2>
                    <p className="mt-2 text-white/50 text-sm max-w-xs">
                        We diagnose at the chip level.
                    </p>
                </motion.div>

                {/* End Text */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6"
                    animate={{ opacity: currentFrame >= 220 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl md:text-4xl font-bold text-white" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.9)' }}>
                        Restored. Perfected.
                    </h2>
                    <p className="mt-2 text-white/50 text-sm max-w-xs">
                        Your MacBook, like new.
                    </p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2"
                    animate={{ opacity: currentFrame < 10 ? 1 : 0 }}
                >
                    <div className="flex flex-col items-center text-white/30">
                        <span className="text-[10px] uppercase tracking-[0.2em] mb-2">Scroll</span>
                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-4 h-6 border border-white/20 rounded-full flex items-start justify-center p-1"
                        >
                            <div className="w-0.5 h-1.5 bg-white/40 rounded-full" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* 
                SPACER - This creates the scroll distance for the animation
                While scrolling through this, the fixed hero stays in place
            */}
            <div style={{ height: `${SCROLL_DISTANCE}px` }} className="bg-black" />
        </>
    );
}
