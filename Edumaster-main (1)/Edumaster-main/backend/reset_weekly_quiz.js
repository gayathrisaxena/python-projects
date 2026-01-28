const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetWeeklyQuiz() {
    try {
        console.log('Deleting existing weekly quizzes...');
        const deleted = await prisma.quiz.deleteMany({
            where: { type: 'WEEKLY' }
        });
        console.log(`Deleted ${deleted.count} weekly quizzes.`);
        console.log('The next time you visit the Weekly Challenge page, a new quiz will be auto-created.');
    } catch (error) {
        console.error('Error resetting weekly quiz:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetWeeklyQuiz();
