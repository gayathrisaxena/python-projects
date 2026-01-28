const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkInstructorData() {
    try {
        console.log('Checking instructor data...');

        const instructors = await prisma.user.findMany({
            where: { role: 'INSTRUCTOR' },
            include: {
                coursesCreated: {
                    select: { id: true, title: true }
                }
            }
        });

        console.log(`Found ${instructors.length} instructors:`);
        instructors.forEach(instructor => {
            console.log(`- ${instructor.name} (${instructor.email})`);
            console.log(`  Courses: ${instructor.coursesCreated.length}`);
            instructor.coursesCreated.forEach(course => {
                console.log(`    * ${course.title}`);
            });
        });

    } catch (error) {
        console.error('Error checking data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkInstructorData();
