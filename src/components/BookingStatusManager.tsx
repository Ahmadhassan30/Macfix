'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type BookingStatus = 'RECEIVED' | 'DIAGNOSING' | 'REPAIRING' | 'TESTING' | 'READY' | 'COMPLETED' | 'CANCELLED';

const statusOptions: { value: BookingStatus; label: string }[] = [
    { value: 'RECEIVED', label: 'Received' },
    { value: 'DIAGNOSING', label: 'Diagnosing' },
    { value: 'REPAIRING', label: 'Repairing' },
    { value: 'TESTING', label: 'Testing' },
    { value: 'READY', label: 'Ready for Pickup' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

export default function BookingStatusManager({ bookingId, currentStatus }: { bookingId: string; currentStatus: string }) {
    const router = useRouter();
    const [status, setStatus] = useState<BookingStatus>(currentStatus as BookingStatus);
    const [message, setMessage] = useState('');
    const [notify, setNotify] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/bookings/${bookingId}/updates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, message, notify }),
            });

            if (res.ok) {
                setMessage('');
                router.refresh(); // Refresh server component to show new update in list
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Update Status</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">New Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as BookingStatus)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-blue-500 outline-none"
                    >
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">Update Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`e.g. Technician has started working on the ${status.toLowerCase()} phase.`}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-blue-500 outline-none min-h-[100px]"
                        required
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="notify"
                        checked={notify}
                        onChange={(e) => setNotify(e.target.checked)}
                        className="w-5 h-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="notify" className="text-sm font-medium text-neutral-700 cursor-pointer select-none">
                        Send email notification to customer
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-black text-white rounded-full font-bold hover:bg-neutral-800 transition-all disabled:opacity-50"
                >
                    {loading ? 'Updating...' : 'Update Booking'}
                </button>
            </form>
        </div>
    );
}
