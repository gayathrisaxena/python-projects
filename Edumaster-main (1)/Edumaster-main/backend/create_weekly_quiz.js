const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Check if a weekly quiz already exists
    const existing = await prisma.quiz.findFirst({ where: { type: 'WEEKLY' } });
    if (existing) {
        console.log('Weekly quiz already exists with id:', existing.id);
        return;
    }

    const weeklyQuiz = await prisma.quiz.create({
        data: {
            title: 'Weekly Challenge',
            type: 'WEEKLY',
            passingScore: 70,
            questions: {
                create: [
                    {
                        question: 'What is 2 + 2?',
                        options: ['3', '4', '5'],
                        correctAnswer: '4',
                        points: 1,
                        order: 1,
                    },
                    {
                        question: 'What is the capital of France?',
                        options: ['Paris', 'Berlin', 'Rome'],
                        correctAnswer: 'Paris',
                        points: 1,
                        order: 2,
                    },
                ],
            },
        },
        include: { questions: true },
    });
    console.log('Created weekly quiz with id:', weeklyQuiz.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
