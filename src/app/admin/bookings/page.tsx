import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { BookingStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
    const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            updates: {
                orderBy: { createdAt: 'desc' },
                take: 1,
            }
        }
    });

    return (
        <div>
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Bookings</h1>
                    <p className="text-neutral-500">Track and manage repair requests.</p>
                </div>
            </header>

            <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Ref Code</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Device</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-neutral-50/80 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-neutral-500">{booking.trackingCode}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{booking.customerName}</div>
                                        <div className="text-xs text-neutral-400">{booking.email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{booking.device}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={booking.status} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-500">
                                        {new Date(booking.createdAt).toLocaleDateString()} <br />
                                        <span className="text-xs text-neutral-400">{new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* TODO: Add Edit/Update functionality */}
                                        <div className="flex items-center gap-4">
                                            <Link href={`/admin/bookings/${booking.id}`} className="text-black hover:underline text-sm font-bold bg-neutral-100 px-3 py-1 rounded-full">
                                                Manage
                                            </Link>
                                            <Link href={`/track?code=${booking.trackingCode}`} className="text-blue-600 hover:underline text-sm font-medium" target="_blank">
                                                Track
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {bookings.length === 0 && (
                    <div className="p-12 text-center text-neutral-400">
                        No bookings found.
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        RECEIVED: 'bg-blue-100 text-blue-700',
        DIAGNOSING: 'bg-amber-100 text-amber-700',
        REPAIRING: 'bg-orange-100 text-orange-700',
        TESTING: 'bg-purple-100 text-purple-700',
        READY: 'bg-green-100 text-green-700',
        COMPLETED: 'bg-emerald-100 text-emerald-700',
        CANCELLED: 'bg-red-100 text-red-700',
    };

    const style = styles[status] || 'bg-neutral-100 text-neutral-700';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${style}`}>
            {status}
        </span>
    );
}
