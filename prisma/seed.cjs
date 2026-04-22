const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Memulai proses seeding data (mengisi data awal)...');

    const hashedPassword = await bcrypt.hash('123', 10);

    // Seed Super Admin
    const superadmin = await prisma.user.upsert({
        where: { username: 'superadmin' },
        update: {},
        create: {
            username: 'superadmin',
            password: hashedPassword,
            name: 'Super Administrator',
            role: 'super_admin',
            avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100',
        },
    });
    console.log('✅ Berhasil membuat akun:', superadmin.username);

    // Seed Dosen
    const dosen = await prisma.user.upsert({
        where: { username: 'dosen' },
        update: {},
        create: {
            username: 'dosen',
            password: hashedPassword,
            name: 'Dr. Eng. Budi Santoso',
            role: 'lecturer',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
        },
    });
    console.log('✅ Berhasil membuat akun:', dosen.username);

    console.log('🎉 Seeding selesai! Anda sekarang bisa login.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
