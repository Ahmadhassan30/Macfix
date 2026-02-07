'use client';

import { useState, useEffect } from 'react';
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

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: string }> = {
    RECEIVED: { label: 'Received', color: 'from-blue-500 to-blue-600', icon: '📦' },
    DIAGNOSING: { label: 'Diagnosing', color: 'from-yellow-500 to-yellow-600', icon: '🔍' },
    REPAIRING: { label: 'Repairing', color: 'from-orange-500 to-orange-600', icon: '🔧' },
    TESTING: { label: 'Testing', color: 'from-purple-500 to-purple-600', icon: '⚡' },
    READY: { label: 'Ready for Pickup', color: 'from-green-500 to-green-600', icon: '✅' },
    COMPLETED: { label: 'Completed', color: 'from-emerald-500 to-emerald-600', icon: '🎉' },
    CANCELLED: { label: 'Cancelled', color: 'from-red-500 to-red-600', icon: '❌' },
};

export default function TrackPage() {
    const searchParams = useSearchParams();
    const [trackingCode, setTrackingCode] = useState(searchParams.get('code') || '');
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [updates, setUpdates] = useState<TrackingUpdate[]>([]);
    const [error, setError] = useState('');

    const handleTrack = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!trackingCode.trim()) return;

        setLoading(true);
        setError('');
        setBooking(null);

        try {
            const res = await fetch(`/api/bookings/track/${trackingCode.trim()}`);
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

    useEffect(() => {
        if (searchParams.get('code')) {
            handleTrack();
        }
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-neutral-900">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                        MACFIX
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                        Track Your Repair
                    </h1>
                    <p className="text-xl text-neutral-400 mb-12">
                        Enter your tracking code to see the status of your device repair.
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleTrack} className="mb-12">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={trackingCode}
                                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                                placeholder="Enter tracking code (e.g., ABC123XYZ0)"
                                className="flex-1 px-6 py-5 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono text-lg"
                            />
                            <motion.button
                                type="submit"
                                disabled={loading || !trackingCode.trim()}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-bold text-lg hover:from-blue-500 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Tracking...' : 'Track'}
                            </motion.button>
                        </div>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-8"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Booking Details */}
                    {booking && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Status Card */}
                            <div className={`bg-gradient-to-br ${statusConfig[booking.status].color} p-8 rounded-2xl`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-white/80 mb-2">Current Status</p>
                                        <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                                            <span>{statusConfig[booking.status].icon}</span>
                                            {statusConfig[booking.status].label}
                                        </h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-white/80 mb-1">Tracking Code</p>
                                        <p className="text-2xl font-mono font-bold text-white">{trackingCode}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Device Info */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                                    <p className="text-sm text-neutral-500 mb-2">Customer</p>
                                    <p className="text-xl font-semibold">{booking.customerName}</p>
                                </div>
                                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                                    <p className="text-sm text-neutral-500 mb-2">Device</p>
                                    <p className="text-xl font-semibold">{booking.device}</p>
                                </div>
                                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                                    <p className="text-sm text-neutral-500 mb-2">Submitted</p>
                                    <p className="text-xl font-semibold">
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-8">Repair Timeline</h3>
                                <div className="space-y-6">
                                    {updates.map((update, index) => (
                                        <motion.div
                                            key={update.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="flex gap-6"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${statusConfig[update.status].color} flex items-center justify-center text-2xl`}>
                                                    {statusConfig[update.status].icon}
                                                </div>
                                                {index < updates.length - 1 && (
                                                    <div className="w-0.5 h-full bg-neutral-800 mt-2" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-8">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="text-lg font-semibold">{statusConfig[update.status].label}</h4>
                                                    <span className="text-sm text-neutral-500">
                                                        {new Date(update.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-neutral-400">{update.message}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
