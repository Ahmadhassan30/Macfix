import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('Testing App Prisma Instance...');
    try {
        // Simple query
        const count = await prisma.booking.count();
        console.log('Booking count:', count);

        // Test specific tracking code query
        const code = 'BVG8DAKUQY'; // From user report
        const booking = await prisma.booking.findUnique({
            where: { trackingCode: code },
            include: { updates: true }
        });
        console.log(`Booking ${code}:`, booking ? 'Found' : 'Not Found');
        if (booking) {
            console.log('Updates:', booking.updates);
        }

    } catch (e) {
        console.error('Test Failed:', e);
    } finally {
        // await prisma.$disconnect(); // src/lib/prisma manages connection
    }
}

main();
