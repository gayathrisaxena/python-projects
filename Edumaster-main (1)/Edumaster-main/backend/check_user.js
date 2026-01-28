const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'student0@edumaster.com' }
        });

        if (user) {
            console.log('✅ User found:', user.email, user.role);
        } else {
            console.log('❌ User student0@edumaster.com NOT found!');
            // List some users to see what we have
            const users = await prisma.user.findMany({ take: 5 });
            console.log('Sample users:', users.map(u => u.email));
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
