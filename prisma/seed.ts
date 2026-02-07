import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

    const admin = await prisma.admin.upsert({
        where: { email: process.env.ADMIN_EMAIL || 'admin@macfix.com' },
        update: {},
        create: {
            email: process.env.ADMIN_EMAIL || 'admin@macfix.com',
            name: 'Admin',
            password: hashedPassword,
        },
    });

    console.log('✅ Admin user created:', admin.email);

    // Create sample products
    const products = await prisma.product.createMany({
        data: [
            {
                name: 'MacBook Pro Charger 96W',
                description: 'Original Apple 96W USB-C Power Adapter for MacBook Pro 16-inch',
                price: 79.99,
                category: 'CHARGER',
                inStock: true,
            },
            {
                name: 'MacBook Air Battery',
                description: 'Replacement battery for MacBook Air 13-inch (M1, 2020)',
                price: 129.99,
                category: 'BATTERY',
                inStock: true,
            },
            {
                name: 'MacBook Pro Screen Protector',
                description: 'Anti-glare screen protector for MacBook Pro 14-inch',
                price: 29.99,
                category: 'SCREEN',
                inStock: true,
            },
            {
                name: 'USB-C to Lightning Cable',
                description: 'Apple 1m USB-C to Lightning Cable for fast charging',
                price: 19.99,
                category: 'CABLE',
                inStock: true,
            },
            {
                name: 'MacBook Leather Sleeve',
                description: 'Premium leather sleeve for MacBook Pro 16-inch',
                price: 149.99,
                category: 'CASE',
                inStock: true,
            },
        ],
        skipDuplicates: true,
    });

    console.log(`✅ Created ${products.count} sample products`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
