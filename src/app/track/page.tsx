'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type BookingStatus = 'RECEIVED' | 'DIAGNOSING' | 'REPAIRING' | 'TESTING' | 'READY' | 'COMPLETED' | 'CANCELLED';

interface TrackingUpdate {
    id: string;
    status: BookingStatus;
    message: string;
    createdAt: string;
}

interface Booking {
    id: string;
    customerName: string;
    device: string;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
}

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string; icon: string }> = {
    RECEIVED: { label: 'Received', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: '📦' },
    DIAGNOSING: { label: 'Diagnosing', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: '🔍' },
    REPAIRING: { label: 'Repairing', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', icon: '🔧' },
    TESTING: { label: 'Testing', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', icon: '⚡' },
    READY: { label: 'Ready for Pickup', color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: '✅' },
    COMPLETED: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: '🎉' },
    CANCELLED: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: '❌' },
};

function TrackContent() {
    const searchParams = useSearchParams();
    const [trackingCode, setTrackingCode] = useState(searchParams.get('code') || '');
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [updates, setUpdates] = useState<TrackingUpdate[]>([]);
    const [error, setError] = useState('');

    const handleTrack = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const codeToTrack = trackingCode || searchParams.get('code') || '';
        if (!codeToTrack.trim()) return;

        setLoading(true);
        setError('');
        setBooking(null);

        // Update tracking code state if coming from URL param
        if (searchParams.get('code') && !trackingCode) {
            setTrackingCode(searchParams.get('code') || '');
        }

        try {
            const res = await fetch(`/api/bookings/track/${encodeURIComponent(codeToTrack.trim())}`);
            const data = await res.json();

            if (data.success) {
                setBooking(data.booking);
                setUpdates(data.updates);
            } else {
                setError(data.error || 'Booking not found');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-track on mount if code present
    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            setTrackingCode(code);
            // We can't call handleTrack directly easily inside useEffect if relying on state closures
            // Instead, define fetch logic or use a ref, or just reuse the fetch logic.
            // Simplified:
            const fetchInitial = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`/api/bookings/track/${encodeURIComponent(code.trim())}`);
                    const data = await res.json();
                    if (data.success) {
                        setBooking(data.booking);
                        setUpdates(data.updates);
                    } else {
                        setError(data.error || 'Booking not found');
                    }
                } catch (e) {
                    setError('Network error.');
                } finally {
                    setLoading(false);
                }
            };
            fetchInitial();
        }
    }, [searchParams]);

    return (
        <div className="max-w-5xl mx-auto px-6 pt-40 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <span className="text-blue-600 font-mono text-sm tracking-widest uppercase mb-4 block">Status Center</span>
                <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tighter text-black leading-[0.9]">
                    Track your<br />
                    repair progress.
                </h1>
                <p className="text-xl text-neutral-500 mb-12 font-light max-w-xl">
                    Enter your unique tracking identifier to view real-time updates.
                </p>

                {/* Search Form */}
                <form onSubmit={handleTrack} className="mb-16">
                    <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
                        <input
                            type="text"
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                            placeholder="Tracking Code (e.g. MK29X...)"
                            className="flex-1 px-8 py-6 bg-neutral-50 border border-neutral-200 rounded-full focus:border-blue-500 focus:ring-0 outline-none transition-all font-mono text-lg uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal hover:bg-neutral-100/50 focus:bg-white"
                        />
                        <motion.button
                            type="submit"
                            disabled={loading || !trackingCode.trim()}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className="px-10 py-6 bg-black text-white rounded-full font-bold text-lg hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {loading ? 'Locating...' : 'Track Device'}
                        </motion.button>
                    </div>
                </form>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 max-w-2xl mb-8"
                    >
                        <span className="font-bold mr-2">Error:</span> {error}
                    </motion.div>
                )}

                {/* Booking Details */}
                {booking && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="space-y-8"
                    >
                        {/* Main Status Card */}
                        <div className={`border ${statusConfig[booking.status].bg} p-10 rounded-3xl relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl select-none pointer-events-none grayscale">
                                {statusConfig[booking.status].icon}
                            </div>
                            <div className="relative z-10">
                                <p className="text-sm font-medium opacity-60 uppercase tracking-widest mb-2">Current Status</p>
                                <h2 className={`text-5xl font-bold ${statusConfig[booking.status].color} flex items-center gap-4 mb-8 tracking-tight`}>
                                    {statusConfig[booking.status].label}
                                </h2>

                                <div className="grid sm:grid-cols-3 gap-8 pt-8 border-t border-black/5">
                                    <div>
                                        <p className="text-xs text-black/50 uppercase tracking-widest mb-1">Device</p>
                                        <p className="font-semibold text-lg">{booking.device}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-black/50 uppercase tracking-widest mb-1">Owner</p>
                                        <p className="font-semibold text-lg">{booking.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-black/50 uppercase tracking-widest mb-1">Last Update</p>
                                        <p className="font-semibold text-lg font-mono">
                                            {new Date(booking.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white border border-neutral-100 rounded-3xl p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                            <h3 className="text-2xl font-bold mb-10 tracking-tight">Activity Log</h3>
                            <div className="space-y-10 relative before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-100">
                                {updates.map((update, index) => (
                                    <motion.div
                                        key={update.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="flex gap-8 relative"
                                    >
                                        <div className="flex flex-col items-center z-10">
                                            <div className="w-14 h-14 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center text-2xl relative z-10">
                                                <div className={`w-full h-full rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-50 text-blue-600' : 'bg-neutral-50 text-neutral-400 grayscale'}`}>
                                                    {statusConfig[update.status].icon}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                                <h4 className={`text-lg font-bold ${index === 0 ? 'text-black' : 'text-neutral-500'}`}>
                                                    {statusConfig[update.status].label}
                                                </h4>
                                                <span className="text-sm font-mono text-neutral-400 bg-neutral-50 px-3 py-1 rounded-full">
                                                    {new Date(update.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-neutral-600 leading-relaxed max-w-2xl">
                                                {update.message}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default function TrackPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-neutral-100">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
                <div className="max-w-screen-xl mx-auto px-6 py-6 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold tracking-tighter">
                        MACFIX
                    </Link>
                    <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-black transition-colors">
                        Close
                    </Link>
                </div>
            </div>

            <Suspense fallback={
                <div className="flex justify-center items-center h-screen pt-40">
                    <div className="w-8 h-8 rounded-full border-4 border-neutral-200 border-t-black animate-spin"></div>
                </div>
            }>
                <TrackContent />
            </Suspense>
        </div>
    );
}
