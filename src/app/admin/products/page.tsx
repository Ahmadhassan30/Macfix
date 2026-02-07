import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Products</h1>
                    <p className="text-neutral-500">Manage your product catalog.</p>
                </div>
                <Link href="/admin/products/new">
                    <button className="px-6 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-neutral-800 transition-all shadow-lg shadow-black/20 flex items-center gap-2">
                        <span>+</span> Add Product
                    </button>
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col group hover:shadow-xl transition-all duration-300">
                        <div className="aspect-square bg-neutral-50 rounded-xl mb-4 relative overflow-hidden">
                            {product.imageUrl ? (
                                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-20">📦</div>
                            )}
                            {/* Actions Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                                <span className="font-mono text-sm">${product.price}</span>
                            </div>
                            <p className="text-neutral-500 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                                <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-md">
                                    {product.category}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 border-dashed">
                    <p className="text-neutral-400 mb-4">No products found</p>
                    <Link href="/admin/products/new" className="text-blue-600 font-bold hover:underline">Create your first product</Link>
                </div>
            )}
        </div>
    );
}
