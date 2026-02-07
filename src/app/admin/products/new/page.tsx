'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UploadDropzone } from '@/utils/uploadthing';
import Image from 'next/image';

type ProductCategory = 'CHARGER' | 'BATTERY' | 'SCREEN' | 'KEYBOARD' | 'TRACKPAD' | 'CABLE' | 'ADAPTER' | 'CASE' | 'OTHER';

const categories: ProductCategory[] = ['CHARGER', 'BATTERY', 'SCREEN', 'KEYBOARD', 'TRACKPAD', 'CABLE', 'ADAPTER', 'CASE', 'OTHER'];

export default function AddProductPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'OTHER' as ProductCategory,
        inStock: true,
        imageUrl: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.error || 'Failed to create product');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-neutral-100 shadow-sm text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 tracking-tight">Product Added</h1>
                    <p className="text-neutral-500 mb-8">&quot;{formData.name}&quot; has been added to the catalog.</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => {
                                setSuccess(false);
                                setFormData({
                                    name: '',
                                    description: '',
                                    price: '',
                                    category: 'OTHER',
                                    inStock: true,
                                    imageUrl: '',
                                });
                            }}
                            className="px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors text-sm"
                        >
                            Add Another
                        </button>
                        <Link href="/admin/products">
                            <button className="px-6 py-2.5 bg-white border border-neutral-200 text-black rounded-full font-medium hover:bg-neutral-50 transition-colors text-sm">
                                View Catalog
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Add New Product</h1>
                    <p className="text-neutral-500">Create a new item in your inventory.</p>
                </div>
                <Link href="/admin/products" className="text-sm font-medium text-neutral-500 hover:text-black transition-colors px-4 py-2 hover:bg-neutral-100 rounded-lg">
                    Cancel
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Image Upload */}
                    <div className="space-y-4">
                        <span className="block text-sm font-medium text-neutral-900">Product Image</span>
                        {formData.imageUrl ? (
                            <div className="relative w-full aspect-video bg-neutral-50 rounded-2xl overflow-hidden group border border-neutral-100">
                                <Image
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium backdrop-blur-sm"
                                >
                                    Remove & Replace
                                </button>
                            </div>
                        ) : (
                            <UploadDropzone
                                endpoint="productImage"
                                onClientUploadComplete={(res) => {
                                    if (res?.[0]) {
                                        setFormData({ ...formData, imageUrl: res[0].url });
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    alert(`ERROR! ${error.message}`);
                                }}
                                className="ut-label:text-blue-600 ut-button:bg-black ut-button:hover:bg-neutral-800 border-2 border-dashed border-neutral-200 hover:border-blue-500 transition-colors rounded-2xl p-8 bg-neutral-50/50"
                            />
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-900">Product Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                placeholder="e.g. MagSafe Charger"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-900">Price ($)</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Category & Stock */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-900">Category</label>
                            <div className="relative">
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end pb-3">
                            <label className="flex items-center gap-3 cursor-pointer select-none group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.inStock ? 'bg-black border-black' : 'border-neutral-300 bg-white'}`}>
                                    {formData.inStock && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.inStock}
                                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                    className="hidden"
                                />
                                <span className="text-sm font-medium text-neutral-900 group-hover:text-black">Available In Stock</span>
                            </label>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-900">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-y min-h-[100px]"
                            placeholder="Detailed product information..."
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="pt-4 border-t border-neutral-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10 active:scale-95 flex items-center justify-center gap-2 float-right"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                'Save Product'
                            )}
                        </button>
                        <div className="clear-both"></div>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
