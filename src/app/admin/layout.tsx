import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-neutral-50 font-sans text-black">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-neutral-200 p-6 flex flex-col fixed h-full z-10">
                <Link href="/admin" className="text-2xl font-bold tracking-tighter mb-12 block">
                    MACFIX <span className="text-neutral-400 font-normal">ADMIN</span>
                </Link>

                <nav className="flex-1 space-y-2">
                    <SidebarLink href="/admin" label="Overview" icon="📊" />
                    <SidebarLink href="/admin/bookings" label="Bookings" icon="🔧" />
                    <SidebarLink href="/admin/products" label="Products" icon="📦" />
                </nav>

                <div className="pt-6 border-t border-neutral-100">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-50 transition-all font-medium text-sm">
                        <span>←</span> Back to Website
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-10 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ href, label, icon }: { href: string; label: string; icon: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-black font-medium transition-all group"
        >
            <span className="grayscale group-hover:grayscale-0 transition-all">{icon}</span>
            {label}
        </Link>
    );
}
