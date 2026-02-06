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

    // Preload all images
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        const loadImage = (index: number) => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                // Frame number with 5-digit padding: 00001, 00002, ..., 00192
                const frameNumber = String(index + 1).padStart(FRAME_PADDING, '0');
                img.src = `${FRAME_PATH}${frameNumber}${FRAME_EXTENSION}`;

                img.onload = () => {
                    loadedImages[index] = img;
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                    resolve();
                };

                img.onerror = () => {
                    console.warn(`Failed to load: ${FRAME_PATH}${frameNumber}${FRAME_EXTENSION}`);
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

            {/* FIXED HERO - Stays in place while scrolling */}
            <div
                className={`${animationComplete ? 'relative' : 'fixed'} inset-0 w-full h-screen bg-black z-40`}
            >
                {/* Canvas Container */}
                <div className="w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full max-w-5xl max-h-[80vh] px-4 flex items-center justify-center">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full"
                        />
                        {/* PATCH: Cover bottom-right watermark relative to image/canvas */}
                        <div className="absolute bottom-4 right-4 w-48 h-24 bg-black z-50" />
                    </div>
                </div>

                {/* Hero Text */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10"
                    animate={{ opacity: currentFrame < 15 ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {imagesLoaded && (
                        <>
                            <motion.h1
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[12vw] font-bold text-white tracking-tighter leading-[0.85] mix-blend-difference"
                            >
                                MACFIX<br />PRO
                            </motion.h1>
                        </>
                    )}
                </motion.div>

                {/* Mid Text */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-start justify-center pointer-events-none px-6 md:px-20 z-10"
                    animate={{ opacity: currentFrame >= 60 && currentFrame < 130 ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-[8vw] font-bold text-white tracking-tighter leading-none mix-blend-difference">
                        INSIDE<br />
                        OUT.
                    </h2>
                </motion.div>

                {/* End Text */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-end justify-center text-right pointer-events-none px-6 md:px-20 z-10"
                    animate={{ opacity: currentFrame >= 175 ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-[8vw] font-bold text-white tracking-tighter leading-none mix-blend-difference">
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
