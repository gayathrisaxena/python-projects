// seed_cse_quiz.js
// Run this script to create a CSE quiz for a specific course (replace COURSE_ID as needed)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // TODO: set the courseId of a CSE course you want to attach the quiz to
    const courseId = process.env.CSE_COURSE_ID || 'replace-with-course-id';

    // Verify the course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
        console.error('Course not found. Please set a valid CSE course ID.');
        process.exit(1);
    }

    // Create the quiz
    const quiz = await prisma.quiz.create({
        data: {
            title: 'CSE Fundamentals Quiz',
            type: 'CSE',
            courseId: courseId,
            questions: {
                create: [
                    {
                        question: 'What does CPU stand for?',
                        options: ['Central Processing Unit', 'Computer Personal Unit', 'Control Program Utility'],
                        correctAnswer: 'Central Processing Unit',
                        points: 10,
                        order: 1,
                    },
                    {
                        question: 'Which data structure follows FIFO order?',
                        options: ['Stack', 'Queue', 'Tree'],
                        correctAnswer: 'Queue',
                        points: 10,
                        order: 2,
                    },
                    {
                        question: 'What is the time complexity of binary search on a sorted array?',
                        options: ['O(n)', 'O(log n)', 'O(1)'],
                        correctAnswer: 'O(log n)',
                        points: 10,
                        order: 3,
                    },
                ],
            },
        },
        include: { questions: true },
    });

    console.log('CSE quiz created:', quiz);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
