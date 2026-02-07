import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BookingStatusManager from '@/components/BookingStatusManager';

type Params = Promise<{ id: string }>;

export default async function BookingDetailPage(props: { params: Params }) {
    const params = await props.params;
    const { id } = params;

    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            updates: {
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!booking) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
                <div>
                    <Link href="/admin/bookings" className="text-sm font-medium text-neutral-500 hover:text-black mb-4 inline-block">
                        ← Back to Bookings
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Booking #{booking.trackingCode}</h1>
                    <p className="text-neutral-500 text-lg">{booking.device} • {booking.customerName}</p>
                </div>
                <div className="text-right">
                    <span className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-neutral-100 text-neutral-700 tracking-wide uppercase">
                        {booking.status}
                    </span>
                    <p className="text-sm text-neutral-400 mt-2">
                        Created {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Timeline - Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-8">Activity Timeline</h2>
                        <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-100 pl-2">
                            {booking.updates.map((update, index) => (
                                <div key={update.id} className="flex gap-6 relative">
                                    <div className="z-10 bg-white p-1 rounded-full border border-neutral-100 shadow-sm mt-1">
                                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-neutral-300'}`}></div>
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-bold text-lg">{update.status}</h3>
                                            <span className="text-xs font-mono text-neutral-400">
                                                {new Date(update.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl text-sm">
                                            {update.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {booking.updates.length === 0 && (
                                <p className="text-neutral-400 italic pl-8">No updates recorded yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-200">
                        <h3 className="font-bold text-lg mb-4">Customer Details</h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Name</p>
                                <p className="font-medium">{booking.customerName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Email</p>
                                <p className="font-medium">{booking.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Phone</p>
                                <p className="font-medium">{booking.phone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Tracking Link</p>
                                <Link href={`/track?code=${booking.trackingCode}`} className="text-blue-600 hover:underline text-sm truncate block" target="_blank">
                                    /track?code={booking.trackingCode}
                                </Link>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-neutral-200">
                            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Original Issue</p>
                            <p className="bg-white p-4 rounded-xl text-neutral-700 italic border border-neutral-200 text-sm">
                                &quot;{booking.issue}&quot;
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions - Right Column */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <BookingStatusManager bookingId={booking.id} currentStatus={booking.status} />
                    </div>
                </div>
            </div>
        </div>
    );
}
