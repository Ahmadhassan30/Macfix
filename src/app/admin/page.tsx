import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const stats = {
        totalBookings: await prisma.booking.count(),
        pendingRepairs: await prisma.booking.count({ where: { status: { in: ['RECEIVED', 'DIAGNOSING', 'REPAIRING', 'TESTING'] } } }),
        completedRepairs: await prisma.booking.count({ where: { status: 'COMPLETED' } }),
        totalProducts: await prisma.product.count(),
    };

    const recentBookings = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <header className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
                <p className="text-neutral-500">Welcome back, Admin.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard label="Total Bookings" value={stats.totalBookings} color="bg-blue-50 text-blue-600" />
                <StatCard label="Active Repairs" value={stats.pendingRepairs} color="bg-amber-50 text-amber-600" />
                <StatCard label="Completed" value={stats.completedRepairs} color="bg-emerald-50 text-emerald-600" />
                <StatCard label="Products" value={stats.totalProducts} color="bg-neutral-100 text-neutral-600" />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Recent Bookings</h2>
                    <Link href="/admin/bookings" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-neutral-100 text-sm text-neutral-500">
                                <th className="pb-4 font-normal pl-4">Customer</th>
                                <th className="pb-4 font-normal">Device</th>
                                <th className="pb-4 font-normal">Status</th>
                                <th className="pb-4 font-normal">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {recentBookings.map((booking) => (
                                <tr key={booking.id} className="group hover:bg-neutral-50 transition-colors">
                                    <td className="py-4 pl-4 font-medium rounded-l-xl">{booking.customerName}</td>
                                    <td className="py-4 text-neutral-600">{booking.device}</td>
                                    <td className="py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-neutral-400 font-mono text-xs rounded-r-xl">
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {recentBookings.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-neutral-400">No bookings yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-neutral-500">{label}</p>
            <div className="flex justify-between items-end">
                <p className="text-4xl font-bold tracking-tight">{value}</p>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                    <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                </div>
            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'RECEIVED': return 'bg-blue-100 text-blue-700';
        case 'DIAGNOSING': return 'bg-amber-100 text-amber-700';
        case 'REPAIRING': return 'bg-orange-100 text-orange-700';
        case 'TESTING': return 'bg-purple-100 text-purple-700';
        case 'READY': return 'bg-green-100 text-green-700';
        case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
        case 'CANCELLED': return 'bg-red-100 text-red-700';
        default: return 'bg-neutral-100 text-neutral-700';
    }
}
