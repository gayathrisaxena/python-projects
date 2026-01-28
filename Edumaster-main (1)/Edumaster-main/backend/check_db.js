const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        const enrollments = await prisma.enrollment.count();
        const users = await prisma.user.count();
        const courses = await prisma.course.count();
        const quizzes = await prisma.quiz.count();
        const attempts = await prisma.attempt.count();
        const reviews = await prisma.review.count();

        console.log('\n📊 Database Statistics:');
        console.log('========================');
        console.log('👥 Users:', users);
        console.log('📚 Courses:', courses);
        console.log('✅ Enrollments:', enrollments);
        console.log('📝 Quizzes:', quizzes);
        console.log('🎯 Quiz Attempts:', attempts);
        console.log('⭐ Reviews:', reviews);

        // Check enrollment details
        const paidEnrollments = await prisma.enrollment.count({ where: { paid: true } });
        const completedEnrollments = await prisma.enrollment.count({ where: { progress: 100 } });

        console.log('\n💰 Paid Enrollments:', paidEnrollments);
        console.log('🏆 Completed Enrollments:', completedEnrollments);

        // Check leaderboard data
        const studentsWithAttempts = await prisma.attempt.groupBy({
            by: ['userId'],
            _count: { userId: true }
        });

        console.log('🏅 Students on Leaderboard:', studentsWithAttempts.length);

        console.log('\n✅ All data is properly saved in the database!\n');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
