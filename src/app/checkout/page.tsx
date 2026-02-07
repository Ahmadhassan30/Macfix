'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        country: 'United States',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
                }),
            });

            const data = await res.json();

            if (data.success) {
                clearCart();
                router.push(`/checkout/success?orderId=${data.orderId}`);
            } else {
                alert('Order failed: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <div className="text-6xl mb-4">🛒</div>
                    <h1 className="text-2xl font-bold mb-2">Your Bag is Empty</h1>
                    <p className="text-neutral-500 mb-6">Looks like you haven't added any repair parts yet.</p>
                    <Link href="/products" className="block w-full py-3 bg-black text-white rounded-full font-bold hover:bg-neutral-800 transition-all">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Order Summary */}
                <div className="order-2 lg:order-1">
                    <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-600">Full Name</label>
                                <input required name="customerName" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-600">Email</label>
                                <input required type="email" name="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-600">Phone</label>
                            <input required name="phone" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-600">Address</label>
                            <input required name="address" placeholder="123 Apple St" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-600">City</label>
                                <input required name="city" placeholder="Cupertino" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-600">ZIP Code</label>
                                <input required name="zip" placeholder="95014" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" onChange={handleChange} />
                            </div>
                            <div className="space-y-2 md:col-span-1 col-span-2">
                                <label className="text-sm font-medium text-neutral-600">Country</label>
                                <input required name="country" defaultValue="United States" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-neutral-100">
                            <p className="text-sm text-neutral-500 mb-4">Payment Method</p>
                            <div className="flex gap-4">
                                <div className="flex-1 p-4 border-2 border-blue-500 bg-blue-50 text-blue-700 rounded-xl font-medium text-center cursor-pointer">
                                    Credit Card
                                </div>
                                <div className="flex-1 p-4 border border-neutral-200 text-neutral-400 rounded-xl font-medium text-center cursor-not-allowed">
                                    PayPal (Coming Soon)
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/20"
                        >
                            {submitting ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                {/* Cart Preview */}
                <div className="order-1 lg:order-2">
                    <div className="bg-white p-8 rounded-3xl shadow-sm sticky top-10">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 py-4 border-b border-neutral-100 last:border-0">
                                    <div className="w-16 h-16 bg-neutral-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-lg">📦</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <h3 className="font-medium text-sm">{item.name}</h3>
                                            <p className="font-bold text-sm text-neutral-900">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-4 border-t border-neutral-100">
                            <div className="flex justify-between text-sm text-neutral-500">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-neutral-500">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-4 border-t border-neutral-100">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
