import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

export const runtime = 'edge';

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
app.post('/bookings', zValidator('json', createBookingSchema), async (c) => {
    try {
        const data = c.req.valid('json');

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
