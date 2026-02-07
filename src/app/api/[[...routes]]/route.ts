import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sendEmail } from '@/lib/email';

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

        // Send confirmation email
        const trackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track?code=${booking.trackingCode}`;

        await sendEmail({
            to: booking.email,
            subject: `Booking Confirmed - ${booking.device}`,
            html: `
                <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                    <h1>We've received your request!</h1>
                    <p>Hi ${booking.customerName},</p>
                    <p>Thanks for booking a generic repair for your <strong>${booking.device}</strong>.</p>
                    <p><strong>Ref Code:</strong> ${booking.trackingCode}</p>
                    <p>We will inspect the device and update you shortly.</p>
                    <br/>
                    <a href="${trackUrl}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Track Progress</a>
                </div>
            `
        });

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
        if (error instanceof z.ZodError) {
            return c.json({ success: false, error: error.issues[0].message }, 400);
        }
        console.error('Error creating booking:', error);
        return c.json({ success: false, error: 'Failed to create booking' }, 500);
    }
});

// GET /api/bookings/track/:code - Track booking
app.get('/bookings/track/:code', async (c) => {
    try {
        const trackingCode = c.req.param('code');
        console.log(`Tracking request for code: ${trackingCode}`);

        const booking = await prisma.booking.findUnique({
            where: { trackingCode },
            include: {
                updates: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!booking) {
            console.log(`Booking not found for code: ${trackingCode}`);
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
    } catch (error: any) {
        console.error('Error tracking booking:', error);
        return c.json({ success: false, error: error.message || 'Failed to track booking' }, 500);
    }
});


// Update booking schema
const updateBookingSchema = z.object({
    status: z.enum(['RECEIVED', 'DIAGNOSING', 'REPAIRING', 'TESTING', 'READY', 'COMPLETED', 'CANCELLED']),
    message: z.string().min(2, 'Message required'),
    notify: z.boolean().default(true),
});

// POST /api/bookings/:id/updates - Add update to booking
app.post('/bookings/:id/updates', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const data = updateBookingSchema.parse(body);

        // Update booking status and add tracking entry
        const booking = await prisma.booking.update({
            where: { id },
            data: {
                status: data.status,
                updates: {
                    create: {
                        status: data.status,
                        message: data.message
                    }
                }
            }
        });

        if (data.notify && booking.email) {
            const trackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track?code=${booking.trackingCode}`;

            await sendEmail({
                to: booking.email,
                subject: `Update: Your ${booking.device} is ${data.status}`,
                html: `
                    <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                        <h1 style="color: #333;">Status Updated: ${data.status}</h1>
                        <p>Hi ${booking.customerName},</p>
                        <p>${data.message}</p>
                        <br/>
                        <a href="${trackUrl}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Details</a>
                    </div>
                `
            });
        }

        return c.json({ success: true, booking });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ success: false, error: error.issues[0].message }, 400);
        }
        console.error('Error updating booking:', error);
        return c.json({ success: false, error: 'Failed to update booking' }, 500);
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
