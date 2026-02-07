'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    inStock: boolean;
    imageUrl: string | null;
    description: string;
    category: any;
}

export default function ProductActions({ product }: { product: Product }) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="space-y-4">
            <button
                disabled={!product.inStock}
                onClick={handleAdd}
                className="w-full bg-black text-white font-bold text-lg py-4 rounded-full hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                {added ? (
                    <>
                        <span>Added to Bag</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </>
                ) : !product.inStock ? (
                    'Sold Out'
                ) : (
                    'Add to Bag'
                )}
            </button>
            <p className="text-xs text-center text-neutral-500">
                Free shipping on orders over $50 • 30-day returns
            </p>
        </div>
    );
}
