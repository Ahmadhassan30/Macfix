'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// IMAGE CONFIGURATION
const TOTAL_FRAMES = 192;
const FRAME_PATH = '/sequences/frame_';
const FRAME_EXTENSION = '.webp';
const FRAME_PADDING = 5;
const SCROLL_DISTANCE = 3000;

export default function HeroAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [animationComplete, setAnimationComplete] = useState(false);

    // Refs for smooth animation
    const frameRef = useRef(0);
    const rafRef = useRef<number | undefined>(undefined);
    const lastDrawnFrameRef = useRef(-1);

    // Optimized image loading with progress tracking
    useEffect(() => {
        let isMounted = true;
        const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
        let loadedCount = 0;

        const updateProgress = () => {
            const progress = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
            setLoadProgress(progress);
        };

        // Load first frame with priority
        const loadFirstFrame = async () => {
            const img = new Image();
            img.src = `${FRAME_PATH}${'00001'}${FRAME_EXTENSION}`;

            return new Promise<void>((resolve) => {
                img.onload = () => {
                    if (isMounted) {
                        loadedImages[0] = img;
                        loadedCount++;
                        updateProgress();
                        setImages([...loadedImages]);
                        setImagesLoaded(true); // Unlock UI immediately
                    }
                    resolve();
                };
                img.onerror = () => resolve();
            });
        };

        // Load remaining frames in batches for better performance
        const loadRemainingFrames = async () => {
            const batchSize = 10;

            for (let batch = 0; batch < Math.ceil((TOTAL_FRAMES - 1) / batchSize); batch++) {
                if (!isMounted) break;

                const promises = [];
                const start = batch * batchSize + 1;
                const end = Math.min(start + batchSize, TOTAL_FRAMES);

                for (let i = start; i < end; i++) {
                    const img = new Image();
                    const frameNumber = String(i + 1).padStart(FRAME_PADDING, '0');
                    img.src = `${FRAME_PATH}${frameNumber}${FRAME_EXTENSION}`;

                    const promise = new Promise<void>((resolve) => {
                        img.onload = () => {
                            if (isMounted) {
                                loadedImages[i] = img;
                                loadedCount++;
                                updateProgress();
                            }
                            resolve();
                        };
                        img.onerror = () => resolve();
                    });

                    promises.push(promise);
                }

                await Promise.all(promises);
                if (isMounted) {
                    setImages([...loadedImages]);
                }
            }
        };

        loadFirstFrame().then(() => loadRemainingFrames());

        return () => {
            isMounted = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Smooth scroll handling with RAF
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;

                    if (scrollY <= SCROLL_DISTANCE) {
                        const progress = scrollY / SCROLL_DISTANCE;
                        const frame = Math.min(
                            Math.floor(progress * TOTAL_FRAMES),
                            TOTAL_FRAMES - 1
                        );
                        frameRef.current = frame;
                        setCurrentFrame(frame);
                        setAnimationComplete(false);
                    } else {
                        frameRef.current = TOTAL_FRAMES - 1;
                        setCurrentFrame(TOTAL_FRAMES - 1);
                        setAnimationComplete(true);
                    }

                    ticking = false;
                });

                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Optimized canvas rendering with RAF
    const drawFrame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const targetFrame = frameRef.current;

        // Skip if we already drew this frame
        if (targetFrame === lastDrawnFrameRef.current) return;

        // Find best available frame
        let frameToDraw = targetFrame;
        if (!images[frameToDraw] || !images[frameToDraw].complete) {
            for (let i = targetFrame; i >= 0; i--) {
                if (images[i]?.complete && images[i].naturalWidth > 0) {
                    frameToDraw = i;
                    break;
                }
            }
        }

        const img = images[frameToDraw];
        if (!img?.complete || img.naturalWidth === 0) return;

        const ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: true, // Better performance
            willReadFrequently: false
        });
        if (!ctx) return;

        // Set canvas size with DPR
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
        const rect = canvas.getBoundingClientRect();

        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }

        // Calculate dimensions (contain fit)
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = rect.width / rect.height;

        let drawW, drawH, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
            drawW = rect.width;
            drawH = rect.width / imgRatio;
        } else {
            drawH = rect.height;
            drawW = rect.height * imgRatio;
        }

        offsetX = (rect.width - drawW) / 2;
        offsetY = (rect.height - drawH) / 2;

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Clear and draw
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

        lastDrawnFrameRef.current = targetFrame;
    }, [images]);

    // Continuous RAF loop for buttery smooth rendering
    useEffect(() => {
        const animate = () => {
            drawFrame();
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [drawFrame]);

    // Debounced resize handler
    useEffect(() => {
        let resizeTimeout: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                lastDrawnFrameRef.current = -1; // Force redraw
                drawFrame();
            }, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, [drawFrame]);

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
                    background: 'linear-gradient(to bottom, #87CEFA 0%, #1E90FF 25%, #000000 60%)',
                    willChange: animationComplete ? 'auto' : 'transform' // Performance hint
                }}
            >
                {/* 1. LAYER ONE: HERO TEXT (Behind Laptop) */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-0"
                    animate={{ opacity: currentFrame < 20 ? 1 : 0, scale: currentFrame < 20 ? 1 : 0.95 }}
                    transition={{ duration: 0.8 }}
                >
                    {imagesLoaded && (
                        <motion.h1
                            initial={{ opacity: 0, y: 100, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[18vw] font-black tracking-tighter leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-blue-900 to-black mix-blend-overlay opacity-50"
                            style={{ filter: 'blur(0px)' }}
                        >
                            MACFIX<br />PRO
                        </motion.h1>
                    )}
                </motion.div>

                {/* 2. LAYER TWO: LAPTOP (Middle) */}
                <div className="w-full h-full flex items-center justify-center pointer-events-none relative z-10">
                    <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full object-contain drop-shadow-2xl bg-transparent mix-blend-screen"
                            style={{ willChange: 'contents' }}
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
