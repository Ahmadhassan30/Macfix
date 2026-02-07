'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BookPage() {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        device: '',
        issue: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [trackingCode, setTrackingCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                setTrackingCode(data.trackingCode);
            } else {
                setError(data.error || 'Failed to create booking');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white text-black flex items-center justify-center px-6 font-sans selection:bg-blue-100">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full text-center"
                >
                    <div className="mb-10">
                        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-6xl font-bold mb-6 tracking-tighter text-black">
                            Confirmed.
                        </h1>
                        <p className="text-neutral-500 text-xl font-light">
                            Your recovery sequence has been initiated.
                        </p>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-10 mb-10 shadow-sm">
                        <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-4">Tracking Identifier</p>
                        <div className="text-5xl font-mono font-bold text-blue-600 tracking-tight">
                            {trackingCode}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={`/track?code=${trackingCode}`}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-10 py-4 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors w-full sm:w-auto"
                            >
                                Track Status
                            </motion.button>
                        </Link>
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-10 py-4 bg-white border border-neutral-200 text-black rounded-full font-medium hover:bg-neutral-50 transition-colors w-full sm:w-auto"
                            >
                                Back Home
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

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

            {/* Form */}
            <div className="max-w-3xl mx-auto px-6 pt-40 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-blue-600 font-mono text-sm tracking-widest uppercase mb-4 block">Service Request</span>
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tighter text-black leading-[0.9]">
                        Let&apos;s get you<br />
                        back online.
                    </h1>
                    <p className="text-xl text-neutral-500 mb-16 font-light max-w-xl leading-relaxed">
                        Fill in the details below. Our technicians are ready to diagnose and resurrect your machine.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Name */}
                        <div className="group">
                            <label className="block text-sm font-medium text-neutral-900 mb-3 ml-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                className="w-full px-6 py-5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-blue-500 focus:ring-0 outline-none transition-all text-lg placeholder:text-neutral-300 hover:bg-neutral-100/50 focus:bg-white"
                                placeholder="Steve Jobs"
                            />
                        </div>

                        {/* Email & Phone */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="group">
                                <label className="block text-sm font-medium text-neutral-900 mb-3 ml-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-blue-500 focus:ring-0 outline-none transition-all text-lg placeholder:text-neutral-300 hover:bg-neutral-100/50 focus:bg-white"
                                    placeholder="steve@apple.com"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-sm font-medium text-neutral-900 mb-3 ml-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-blue-500 focus:ring-0 outline-none transition-all text-lg placeholder:text-neutral-300 hover:bg-neutral-100/50 focus:bg-white"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        {/* Device */}
                        <div className="group">
                            <label className="block text-sm font-medium text-neutral-900 mb-3 ml-1">
                                Device Model
                            </label>
                            <div className="relative">
                                <select
                                    required
                                    value={formData.device}
                                    onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-blue-500 focus:ring-0 outline-none transition-all text-lg appearance-none hover:bg-neutral-100/50 focus:bg-white cursor-pointer"
                                >
                                    <option value="">Select your MacBook model</option>
                                    <option value="MacBook Air M1 (2020)">MacBook Air M1 (2020)</option>
                                    <option value="MacBook Air M2 (2022)">MacBook Air M2 (2022)</option>
                                    <option value="MacBook Air M3 (2024)">MacBook Air M3 (2024)</option>
                                    <option value="MacBook Pro 13-inch M1 (2020)">MacBook Pro 13-inch M1 (2020)</option>
                                    <option value="MacBook Pro 14-inch M1 Pro/Max (2021)">MacBook Pro 14-inch M1 Pro/Max (2021)</option>
                                    <option value="MacBook Pro 16-inch M1 Pro/Max (2021)">MacBook Pro 16-inch M1 Pro/Max (2021)</option>
                                    <option value="MacBook Pro 14-inch M3 (2023)">MacBook Pro 14-inch M3 (2023)</option>
                                    <option value="MacBook Pro 16-inch M3 (2023)">MacBook Pro 16-inch M3 (2023)</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Issue */}
                        <div className="group">
                            <label className="block text-sm font-medium text-neutral-900 mb-3 ml-1">
                                Diagnosis / Issue
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formData.issue}
                                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                                className="w-full px-6 py-5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-blue-500 focus:ring-0 outline-none transition-all text-lg placeholder:text-neutral-300 resize-none hover:bg-neutral-100/50 focus:bg-white"
                                placeholder="Describe the symptoms..."
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-8">
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                className="w-full px-8 py-6 bg-black text-white rounded-full font-bold text-xl hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>Processing <span className="animate-pulse">...</span></>
                                ) : (
                                    <>Initiate Repair Sequence</>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
