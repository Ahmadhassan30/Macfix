import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Connecting...');
    try {
        const bookings = await prisma.booking.findMany({
            take: 1
        });
        console.log('Bookings:', bookings);

        if (bookings.length > 0) {
            const trackingCode = bookings[0].trackingCode;
            console.log('Fetching details for code:', trackingCode);

            const detailed = await prisma.booking.findUnique({
                where: { trackingCode },
                include: { updates: true }
            });
            console.log('Detailed:', detailed);
        } else {
            console.log('No bookings found.');
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
