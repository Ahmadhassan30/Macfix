"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MacBookScroll() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        // --- CONFIGURATION ---
        const frameCount = 147;
        const currentFrame = (index: number) =>
            `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(
                index + 1
            )
                .toString()
                .padStart(4, "0")}.jpg`;

        const images: HTMLImageElement[] = [];
        const airpods = {
            frame: 0,
        };

        // 1. Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        // 2. GSAP Animation
        // We use a timeline to sequence the frame updates
        const tl = gsap.to(airpods, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=300%", // 300% scroll distance
                scrub: 0.5,
                pin: true,
            },
            onUpdate: () => {
                const frameIndex = Math.round(airpods.frame);
                if (images[frameIndex] && images[frameIndex].complete) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(images[frameIndex], 0, 0);
                }
            },
        });

        // 3. Initial render
        images[0].onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[0], 0, 0);
        };

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <div ref={containerRef} className="relative h-screen w-full bg-black">
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute top-20 text-center z-10 pointer-events-none mix-blend-difference">
                    <h2 className="text-white text-5xl md:text-6xl font-bold tracking-tighter">
                        PRECISION<br />RESTORATION
                    </h2>
                    <p className="text-neutral-400 mt-4 text-lg font-light tracking-wide">
                        Every detail perfected. Every component renewed.
                    </p>
                </div>
                <canvas
                    ref={canvasRef}
                    width={1158}
                    height={770}
                    className="max-w-[80vw] max-h-[80vh] object-contain"
                />
            </div>
        </div>
    );
}
