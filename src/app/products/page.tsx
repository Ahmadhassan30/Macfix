'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-neutral-900">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                        MACFIX
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                        Premium Accessories
                    </h1>
                    <p className="text-xl text-neutral-400 mb-12">
                        Genuine Apple parts and high-quality accessories for your MacBook.
                    </p>

                    {/* Filters */}
                    <div className="mb-12 space-y-6">
                        {/* Category Filter */}
                        <div>
                            <p className="text-sm text-neutral-400 mb-3">Filter by Category</p>
                            <div className="flex flex-wrap gap-3">
                                {categories.map((category) => (
                                    <motion.button
                                        key={category}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedCategory === category
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                                                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-neutral-700'
                                            }`}
                                    >
                                        {category === 'ALL' ? 'All Products' : categoryLabels[category]}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Stock Filter */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="inStock"
                                checked={showInStockOnly}
                                onChange={(e) => setShowInStockOnly(e.target.checked)}
                                className="w-5 h-5 rounded border-neutral-700 bg-neutral-900 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                            />
                            <label htmlFor="inStock" className="text-neutral-300 cursor-pointer">
                                Show in-stock items only
                            </label>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 animate-pulse">
                                    <div className="aspect-square bg-neutral-800 rounded-xl mb-4" />
                                    <div className="h-6 bg-neutral-800 rounded mb-3" />
                                    <div className="h-4 bg-neutral-800 rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-2xl font-bold text-neutral-400 mb-2">No products found</h3>
                            <p className="text-neutral-500">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer"
                                >
                                    {/* Product Image */}
                                    <div className="aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                                        {product.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="text-6xl">📦</div>
                                        )}
                                        {!product.inStock && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="px-4 py-2 bg-red-500 rounded-lg font-semibold">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                                                {product.name}
                                            </h3>
                                            <span className="text-xs px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full whitespace-nowrap">
                                                {categoryLabels[product.category]}
                                            </span>
                                        </div>
                                        <p className="text-neutral-400 text-sm line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                                            <span className="text-3xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                disabled={!product.inStock}
                                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg font-semibold hover:from-blue-500 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {product.inStock ? 'Add to Cart' : 'Unavailable'}
                                            </motion.button>
                                        </div>
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
