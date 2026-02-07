import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

export const runtime = 'nodejs';

const app = new Hono().basePath('/api');

// CORS middleware
app.use('/*', cors());

// Health check
app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== PUBLIC ROUTES ====================

// Create booking schema
const createBookingSchema = z.object({
    customerName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    device: z.string().min(3, 'Device name is required'),
    issue: z.string().min(10, 'Please describe the issue in detail'),
});

// POST /api/bookings - Create new booking
app.post('/bookings', async (c) => {
    try {
        const body = await c.req.json();
        const data = createBookingSchema.parse(body);

        const booking = await prisma.booking.create({
            data: {
                ...data,
                trackingCode: nanoid(10).toUpperCase(),
                updates: {
                    create: {
                        status: 'RECEIVED',
                        message: 'Your device has been received and is awaiting diagnosis.',
                    },
                },
            },
            include: {
                updates: true,
            },
        });

        // TODO: Send confirmation email

        return c.json({
            success: true,
            trackingCode: booking.trackingCode,
            message: 'Booking created successfully',
            booking: {
                id: booking.id,
                customerName: booking.customerName,
                device: booking.device,
                status: booking.status,
                createdAt: booking.createdAt,
            },
        }, 201);
    } catch (error) {
        console.error('Error creating booking:', error);
        return c.json({ success: false, error: 'Failed to create booking' }, 500);
    }
});

// GET /api/bookings/track/:code - Track booking
app.get('/bookings/track/:code', async (c) => {
    try {
        const trackingCode = c.req.param('code');

        const booking = await prisma.booking.findUnique({
            where: { trackingCode },
            include: {
                updates: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!booking) {
            return c.json({ success: false, error: 'Booking not found' }, 404);
        }

        return c.json({
            success: true,
            booking: {
                id: booking.id,
                customerName: booking.customerName,
                device: booking.device,
                status: booking.status,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
            },
            updates: booking.updates,
        });
    } catch (error) {
        console.error('Error tracking booking:', error);
        return c.json({ success: false, error: 'Failed to track booking' }, 500);
    }
});


// Create product schema
const createProductSchema = z.object({
    name: z.string().min(2),
    description: z.string(),
    price: z.number().positive(),
    category: z.enum(['CHARGER', 'BATTERY', 'SCREEN', 'KEYBOARD', 'TRACKPAD', 'CABLE', 'ADAPTER', 'CASE', 'OTHER']),
    inStock: z.boolean(),
    imageUrl: z.string().optional().nullable(),
});

// POST /api/products - Create new product
app.post('/products', async (c) => {
    try {
        const body = await c.req.json();
        const data = createProductSchema.parse(body);

        const product = await prisma.product.create({
            data: {
                ...data,
                imageUrl: data.imageUrl || null,
            },
        });

        return c.json({ success: true, product }, 201);
    } catch (error) {
        console.error('Error creating product:', error);
        return c.json({ success: false, error: 'Failed to create product' }, 500);
    }
});


// Create order schema
const createOrderSchema = z.object({
    customerName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    address: z.string().min(5),
    city: z.string().min(2),
    zip: z.string().min(3),
    country: z.string().min(2),
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().positive()
    })),
});

// POST /api/orders - Create new order
app.post('/orders', async (c) => {
    try {
        const body = await c.req.json();
        const data = createOrderSchema.parse(body);

        // Fetch products to calculate total
        const productIds = data.items.map(item => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        let total = 0;
        const orderItemsData = [];

        for (const item of data.items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) throw new Error(`Product not found: ${item.productId}`);

            total += product.price * item.quantity;
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });
        }

        const order = await prisma.order.create({
            data: {
                customerName: data.customerName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                zip: data.zip,
                country: data.country,
                total: total,
                items: {
                    create: orderItemsData
                }
            }
        });

        return c.json({ success: true, orderId: order.id }, 201);
    } catch (error) {
        console.error('Error creating order:', error);
        return c.json({ success: false, error: 'Failed to create order' }, 500);
    }
});

// GET /api/products - List products
app.get('/products', async (c) => {
    try {
        const category = c.req.query('category');
        const inStock = c.req.query('inStock');

        const products = await prisma.product.findMany({
            where: {
                ...(category && { category: category as any }),
                ...(inStock !== undefined && { inStock: inStock === 'true' }),
            },
            orderBy: { createdAt: 'desc' },
        });

        return c.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return c.json({ success: false, error: 'Failed to fetch products' }, 500);
    }
});

// Export Next.js handlers
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
