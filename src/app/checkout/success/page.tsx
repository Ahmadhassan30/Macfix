'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm text-center max-w-lg w-full">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                ✓
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-neutral-500 mb-8">
                Thank you for your purchase. We have received your order and will begin processing it right away.
            </p>

            <div className="bg-neutral-50 p-4 rounded-xl mb-8">
                <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold mb-1">Order Reference</p>
                <p className="font-mono text-lg font-medium">{orderId || 'Processing...'}</p>
            </div>

            <div className="space-y-4">
                <Link href={`/track?code=${orderId}`} className="block w-full py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all">
                    Track Order
                </Link>
                <Link href="/" className="block w-full py-3 text-neutral-500 hover:text-black transition-colors">
                    Return Home
                </Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
