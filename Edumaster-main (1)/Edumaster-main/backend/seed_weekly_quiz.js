const prisma = require('./lib/prisma');

async function main() {
    console.log('Seeding weekly quiz...');

    // Check if a weekly quiz already exists
    const existingQuiz = await prisma.quiz.findFirst({
        where: { type: 'WEEKLY' },
    });

    if (existingQuiz) {
        console.log('Weekly quiz already exists. Skipping...');
        return;
    }

    // Create Weekly Quiz
    const quiz = await prisma.quiz.create({
        data: {
            title: 'Weekly Tech Challenge',
            description: 'Test your knowledge of modern web technologies!',
            type: 'WEEKLY',
            passingScore: 60,
            questions: {
                create: [
                    {
                        question: 'What does HTML stand for?',
                        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
                        correctAnswer: 'Hyper Text Markup Language',
                        points: 10,
                        order: 1,
                    },
                    {
                        question: 'Which language is used for styling web pages?',
                        options: ['HTML', 'XML', 'CSS', 'Java'],
                        correctAnswer: 'CSS',
                        points: 10,
                        order: 2,
                    },
                    {
                        question: 'What is React?',
                        options: ['A database', 'A JavaScript library for building user interfaces', 'A server-side framework', 'An operating system'],
                        correctAnswer: 'A JavaScript library for building user interfaces',
                        points: 10,
                        order: 3,
                    },
                    {
                        question: 'Which of these is NOT a JavaScript data type?',
                        options: ['String', 'Boolean', 'Float', 'Undefined'],
                        correctAnswer: 'Float',
                        points: 10,
                        order: 4,
                    },
                    {
                        question: 'What is the purpose of "git"?',
                        options: ['To run JavaScript', 'Version control system', 'A code editor', 'A web browser'],
                        correctAnswer: 'Version control system',
                        points: 10,
                        order: 5,
                    },
                ],
            },
        },
    });

    console.log('Weekly quiz created:', quiz.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
