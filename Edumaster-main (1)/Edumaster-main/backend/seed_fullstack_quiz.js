// seed_fullstack_quiz.js
// Run this script to create a Full‑Stack quiz (10 MCQs) for a specific course.
// Update the COURSE_ID environment variable or replace the placeholder.

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const courseId = process.env.FULLSTACK_COURSE_ID || 'replace-with-course-id';

    // Verify the course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
        console.error('Course not found. Set a valid Full‑Stack course ID.');
        process.exit(1);
    }

    // Create the quiz with 10 questions
    const quiz = await prisma.quiz.create({
        data: {
            title: 'Full‑Stack Development Quiz',
            type: 'FULLSTACK',
            courseId,
            questions: {
                create: [
                    {
                        question: 'Which protocol is used to fetch resources over the web?',
                        options: ['FTP', 'HTTP', 'SMTP'],
                        correctAnswer: 'HTTP',
                        points: 10,
                        order: 1,
                    },
                    {
                        question: 'What does CSS stand for?',
                        options: ['Cascading Style Sheets', 'Computer Style System', 'Creative Styling Syntax'],
                        correctAnswer: 'Cascading Style Sheets',
                        points: 10,
                        order: 2,
                    },
                    {
                        question: 'In React, which hook is used to manage state?',
                        options: ['useEffect', 'useState', 'useContext'],
                        correctAnswer: 'useState',
                        points: 10,
                        order: 3,
                    },
                    {
                        question: 'Which command initializes a new Node.js project?',
                        options: ['npm init', 'node start', 'npm create'],
                        correctAnswer: 'npm init',
                        points: 10,
                        order: 4,
                    },
                    {
                        question: 'What is the default port for a PostgreSQL database?',
                        options: ['5432', '3306', '1521'],
                        correctAnswer: '5432',
                        points: 10,
                        order: 5,
                    },
                    {
                        question: 'Which of the following is a NoSQL database?',
                        options: ['MySQL', 'MongoDB', 'SQLite'],
                        correctAnswer: 'MongoDB',
                        points: 10,
                        order: 6,
                    },
                    {
                        question: 'What does REST stand for?',
                        options: ['Representational State Transfer', 'Remote Execution Service Tool', 'Real-time Event Streaming'],
                        correctAnswer: 'Representational State Transfer',
                        points: 10,
                        order: 7,
                    },
                    {
                        question: 'Which HTML tag is used to embed JavaScript?',
                        options: ['<script>', '<js>', '<code>'],
                        correctAnswer: '<script>',
                        points: 10,
                        order: 8,
                    },
                    {
                        question: 'In Git, which command creates a new branch?',
                        options: ['git branch <name>', 'git checkout <name>', 'git merge <name>'],
                        correctAnswer: 'git branch <name>',
                        points: 10,
                        order: 9,
                    },
                    {
                        question: 'Which CSS property is used to change the text color?',
                        options: ['font-color', 'text-color', 'color'],
                        correctAnswer: 'color',
                        points: 10,
                        order: 10,
                    },
                ],
            },
        },
        include: { questions: true },
    });

    console.log('Full‑Stack quiz created:', quiz);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
