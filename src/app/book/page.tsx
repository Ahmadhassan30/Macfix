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
            <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full text-center"
                >
                    <div className="mb-8">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                            Booking Confirmed!
                        </h1>
                        <p className="text-neutral-400 text-lg mb-8">
                            Your device repair has been scheduled. We&apos;ll take great care of it.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-8 mb-8">
                        <p className="text-sm text-neutral-500 uppercase tracking-wider mb-3">Your Tracking Code</p>
                        <div className="text-4xl font-mono font-bold text-blue-400 mb-4 tracking-wider">
                            {trackingCode}
                        </div>
                        <p className="text-sm text-neutral-400">
                            Save this code to track your repair status
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link href={`/track?code=${trackingCode}`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-semibold hover:from-blue-500 hover:to-blue-600 transition-all"
                            >
                                Track Status
                            </motion.button>
                        </Link>
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-neutral-900 border border-neutral-700 rounded-xl font-semibold hover:bg-neutral-800 transition-all"
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
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-neutral-900">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                        MACFIX
                    </Link>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                        Book a Repair
                    </h1>
                    <p className="text-xl text-neutral-400 mb-12">
                        Professional MacBook repair service. Get your device fixed by experts.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                className="w-full px-4 py-4 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Email & Phone */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-4 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-4 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        {/* Device */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Device Model
                            </label>
                            <select
                                required
                                value={formData.device}
                                onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                                className="w-full px-4 py-4 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
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
                        </div>

                        {/* Issue */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Describe the Issue
                            </label>
                            <textarea
                                required
                                rows={6}
                                value={formData.issue}
                                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                                className="w-full px-4 py-4 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                                placeholder="Please describe the problem in detail..."
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-bold text-lg hover:from-blue-500 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Submit Booking'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
