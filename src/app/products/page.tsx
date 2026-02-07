'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

type ProductCategory = 'CHARGER' | 'BATTERY' | 'SCREEN' | 'KEYBOARD' | 'TRACKPAD' | 'CABLE' | 'ADAPTER' | 'CASE' | 'OTHER';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string | null;
    category: ProductCategory;
    inStock: boolean;
}

const categoryLabels: Record<ProductCategory, string> = {
    CHARGER: 'Chargers',
    BATTERY: 'Batteries',
    SCREEN: 'Screens',
    KEYBOARD: 'Keyboards',
    TRACKPAD: 'Trackpads',
    CABLE: 'Cables',
    ADAPTER: 'Adapters',
    CASE: 'Cases',
    OTHER: 'Other',
};

export default function ProductsPage() {
    const { addItem, cartCount } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>('ALL');
    const [showInStockOnly, setShowInStockOnly] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, showInStockOnly]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
            if (showInStockOnly) params.append('inStock', 'true');

            const res = await fetch(`/api/products?${params}`);
            const data = await res.json();

            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories: (ProductCategory | 'ALL')[] = ['ALL', ...Object.keys(categoryLabels) as ProductCategory[]];

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-neutral-100">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
                <div className="max-w-screen-xl mx-auto px-6 py-6 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold tracking-tighter">
                        MACFIX
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link href="/checkout" className="text-sm font-bold flex items-center gap-2 hover:opacity-70 transition-opacity">
                            <span>Bag</span>
                            {cartCount > 0 && (
                                <span className="bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-black transition-colors">
                            Close
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 pt-40 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-blue-600 font-mono text-sm tracking-widest uppercase mb-4 block">Catalog</span>
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tighter text-black leading-[0.9]">
                        Genuine parts.<br />
                        Premium tools.
                    </h1>
                    <p className="text-xl text-neutral-500 mb-16 font-light max-w-xl">
                        Everything you need to maintain your device, sourced directly from OEM manufacturers.
                    </p>

                    {/* Filters */}
                    <div className="mb-16 space-y-8">
                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                        ? 'bg-black text-white shadow-lg shadow-black/20'
                                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-black'
                                        }`}
                                >
                                    {category === 'ALL' ? 'All Items' : categoryLabels[category]}
                                </button>
                            ))}
                        </div>

                        {/* Stock Filter */}
                        <div className="flex items-center gap-3 pl-1">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${showInStockOnly ? 'bg-blue-600 border-blue-600' : 'border-neutral-300 bg-white group-hover:border-neutral-400'}`}>
                                    {showInStockOnly && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={showInStockOnly}
                                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                                    className="hidden"
                                />
                                <span className={`text-sm font-medium transition-colors ${showInStockOnly ? 'text-black' : 'text-neutral-500 group-hover:text-black'}`}>
                                    Show available items only
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[4/3] bg-neutral-100 rounded-3xl mb-6" />
                                    <div className="h-6 bg-neutral-100 rounded w-2/3 mb-3" />
                                    <div className="h-4 bg-neutral-100 rounded w-1/3" />
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-32 bg-neutral-50 rounded-3xl border border-neutral-100">
                            <div className="text-6xl mb-6 grayscale opacity-20">📦</div>
                            <h3 className="text-2xl font-bold text-neutral-400 mb-2">No items found</h3>
                            <p className="text-neutral-400">Try adjusting your category filters</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group"
                                >
                                    <Link href={`/products/${product.id}`} className="block">
                                        {/* Product Image */}
                                        <div className="aspect-[4/3] bg-neutral-100 rounded-3xl mb-6 relative overflow-hidden group-hover:shadow-2xl group-hover:shadow-black/5 transition-all duration-500">
                                            {product.imageUrl ? (
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                            )}
                                            {!product.inStock && (
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                                    Sold Out
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="space-y-3 px-2">
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="text-2xl font-bold leading-tight text-neutral-900 group-hover:text-blue-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                                <span className="text-lg font-medium text-neutral-900">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2">
                                                {product.description}
                                            </p>
                                        </div>
                                    </Link>

                                    <div className="pt-4 px-2 flex items-center justify-between">
                                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider bg-neutral-100 px-3 py-1 rounded-full">
                                            {categoryLabels[product.category]}
                                        </span>
                                        <button
                                            disabled={!product.inStock}
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent navigation
                                                addItem(product);
                                            }}
                                            className="text-sm font-bold text-blue-600 hover:text-blue-700 disabled:text-neutral-300 disabled:cursor-not-allowed group-hover:translate-x-1 transition-all flex items-center gap-1"
                                        >
                                            {product.inStock ? 'Add to Bag' : 'Unavailable'}
                                            {product.inStock && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
