import type { Metadata } from "next";
import "./globals.css";

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
            <body className="antialiased">{children}</body>
        </html>
    );
}
