import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductActions from '@/components/ProductActions';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

export default async function ProductPage(props: { params: Params }) {
    const params = await props.params;
    const { id } = params;

    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans pt-32 pb-20">
            <div className="max-w-screen-xl mx-auto px-6">
                <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black mb-8 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Catalog
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left: Image */}
                    <div className="relative aspect-[4/3] bg-neutral-100 rounded-3xl overflow-hidden shadow-sm">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        )}
                        {!product.inStock && (
                            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-neutral-500 uppercase tracking-wider shadow-sm">
                                Sold Out
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-4">
                            <span className="text-blue-600 font-bold text-xs tracking-widest uppercase bg-blue-50 px-3 py-1.5 rounded-full">
                                {product.category}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-neutral-900 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-medium text-neutral-900 mb-8">
                            ${product.price.toFixed(2)}
                        </p>

                        <div className="prose prose-neutral mb-12 text-neutral-500 leading-relaxed text-lg">
                            <p>{product.description}</p>
                        </div>

                        <ProductActions product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}
