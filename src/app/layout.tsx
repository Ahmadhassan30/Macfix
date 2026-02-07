import type { Metadata } from "next";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { CartProvider } from "@/context/CartContext";
import SmoothScrolling from "@/components/SmoothScroll";
import "./globals.css";
import "@uploadthing/react/styles.css";

export const metadata: Metadata = {
    title: "MacFix Pro | Expert MacBook Repairs",
    description: "Professional MacBook repair services. Screen replacements, battery repairs, logic board fixes, and more. Fast turnaround, quality parts.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased" suppressHydrationWarning>
                <NextSSRPlugin
                    routerConfig={extractRouterConfig(ourFileRouter)}
                />
                <CartProvider>
                    <SmoothScrolling />
                    {children}
                </CartProvider>
            </body>
        </html>
    );
}
