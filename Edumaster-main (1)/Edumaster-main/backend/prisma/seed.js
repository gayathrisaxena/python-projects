const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting comprehensive database seed...');

    // Clear existing data
    await prisma.announcement.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.attempt.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.progress.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.section.deleteMany();
    await prisma.review.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Admin and Instructors
    const admin = await prisma.user.create({
        data: {
            email: 'admin@edumaster.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
            avatar: 'AU',
        },
    });

    const instructorsData = [
        {
            email: 'john@edumaster.com',
            password: hashedPassword,
            name: 'John Doe',
            role: 'INSTRUCTOR',
            avatar: 'JD',
            bio: 'Senior Full Stack Developer with 10+ years of experience',
        },
        {
            email: 'jane@edumaster.com',
            password: hashedPassword,
            name: 'Jane Smith',
            role: 'INSTRUCTOR',
            avatar: 'JS',
            bio: 'Data Scientist and AI Researcher',
        },
        {
            email: 'mike@edumaster.com',
            password: hashedPassword,
            name: 'Mike Johnson',
            role: 'INSTRUCTOR',
            avatar: 'MJ',
            bio: 'DevOps Engineer and Cloud Architect',
        },
        {
            email: 'sarah@edumaster.com',
            password: hashedPassword,
            name: 'Sarah Wilson',
            role: 'INSTRUCTOR',
            avatar: 'SW',
            bio: 'Cybersecurity Expert and Ethical Hacker',
        }
    ];

    // Create instructors one by one to get IDs
    const instructors = [];
    for (const data of instructorsData) {
        const instructor = await prisma.user.create({ data });
        instructors.push(instructor);
    }

    console.log('✅ Created Instructors');

    const coursesData = [
        {
            title: 'Modern React with Redux',
            slug: 'modern-react-redux',
            description: 'Master React and Redux with this comprehensive course.',
            longDescription: 'Learn React from scratch, including Hooks, Redux, React Router, and more. Build real-world applications.',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
            price: 1999,
            level: 'BEGINNER',
            category: 'Web Development',
            published: true,
            instructorId: instructors[0].id,
            sections: [
                {
                    title: 'Getting Started with React',
                    lessons: [
                        { title: 'Introduction to React', duration: '18 min', preview: true, videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM' },
                        { title: 'Setting Up Environment', duration: '22 min', preview: true, videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk' },
                        { title: 'JSX and Components', duration: '28 min', preview: false, videoUrl: 'https://www.youtube.com/embed/Y6aYx_KKM7A' }
                    ]
                },
                {
                    title: 'React Fundamentals',
                    lessons: [
                        { title: 'Props and State', duration: '32 min', preview: false, videoUrl: 'https://www.youtube.com/embed/m7OWXtbiXX8' },
                        { title: 'Hooks: useState', duration: '38 min', preview: false, videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0' }
                    ]
                }
            ]
        },
        {
            title: 'Node.js & Express Backend Bootcamp',
            slug: 'nodejs-express-backend-bootcamp',
            description: 'Build scalable backend applications with Node.js, Express, MongoDB, and RESTful APIs.',
            longDescription: 'Learn professional backend development from scratch. Master Node.js fundamentals, Express framework, MongoDB database, authentication, and security.',
            thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop',
            price: 2499,
            level: 'INTERMEDIATE',
            category: 'Web Development',
            published: true,
            instructorId: instructors[0].id,
            sections: [
                {
                    title: 'Node.js Basics',
                    lessons: [
                        { title: 'Node.js Architecture', duration: '35 min', preview: true, videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ' },
                        { title: 'Modules and NPM', duration: '28 min', preview: true, videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4' }
                    ]
                },
                {
                    title: 'Express Framework',
                    lessons: [
                        { title: 'Express Routing', duration: '38 min', preview: false, videoUrl: 'https://www.youtube.com/embed/L72fhGm1tfE' },
                        { title: 'Middleware', duration: '45 min', preview: false, videoUrl: 'https://www.youtube.com/embed/DZBGEVgL2eE' }
                    ]
                }
            ]
        },
        {
            title: 'Data Science & Machine Learning with Python',
            slug: 'data-science-ml-python',
            description: 'Complete data science course covering Python, pandas, NumPy, visualization, and machine learning algorithms.',
            longDescription: 'Become a data scientist! Learn Python programming, data analysis with pandas, data visualization, statistics, and machine learning.',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
            price: 2999,
            level: 'BEGINNER',
            category: 'Data Science',
            published: true,
            instructorId: instructors[1].id,
            sections: [
                {
                    title: 'Python for Data Science',
                    lessons: [
                        { title: 'Python Basics', duration: '42 min', preview: true, videoUrl: 'https://www.youtube.com/embed/LHBE6Q9XlzI' },
                        { title: 'NumPy Arrays', duration: '38 min', preview: true, videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI' }
                    ]
                },
                {
                    title: 'Machine Learning',
                    lessons: [
                        { title: 'Intro to ML', duration: '32 min', preview: false, videoUrl: 'https://www.youtube.com/embed/7eh4d6sabA0' },
                        { title: 'Linear Regression', duration: '45 min', preview: false, videoUrl: 'https://www.youtube.com/embed/nk2CQITm_eY' }
                    ]
                }
            ]
        },
        {
            title: 'DevOps Engineering - Docker, Kubernetes & CI/CD',
            slug: 'devops-docker-kubernetes-cicd',
            description: 'Master DevOps practices, containerization, orchestration, and automated deployment pipelines.',
            longDescription: 'Learn industry-standard DevOps tools and practices. Master Docker, Kubernetes, Jenkins, GitHub Actions, monitoring, and cloud deployment.',
            thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop',
            price: 3499,
            level: 'ADVANCED',
            category: 'DevOps',
            published: true,
            instructorId: instructors[2].id,
            sections: [
                {
                    title: 'Docker',
                    lessons: [
                        { title: 'Docker Fundamentals', duration: '35 min', preview: true, videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo' },
                        { title: 'Docker Compose', duration: '40 min', preview: false, videoUrl: 'https://www.youtube.com/embed/HB9V6PZcU7c' }
                    ]
                },
                {
                    title: 'Kubernetes',
                    lessons: [
                        { title: 'K8s Architecture', duration: '45 min', preview: false, videoUrl: 'https://www.youtube.com/embed/X48VuDVv0do' },
                        { title: 'Deployments', duration: '38 min', preview: false, videoUrl: 'https://www.youtube.com/embed/R8_veQiYBjI' }
                    ]
                }
            ]
        },
        {
            title: 'Cybersecurity Fundamentals & Ethical Hacking',
            slug: 'cybersecurity-ethical-hacking',
            description: 'Learn network security, penetration testing, and ethical hacking techniques to protect systems.',
            longDescription: 'Comprehensive cybersecurity course covering network security, cryptography, penetration testing, vulnerability assessment, and security best practices.',
            thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop',
            price: 2799,
            level: 'INTERMEDIATE',
            category: 'Cybersecurity',
            published: true,
            instructorId: instructors[3].id,
            sections: [
                {
                    title: 'Network Security',
                    lessons: [
                        { title: 'Protocols', duration: '30 min', preview: true, videoUrl: 'https://www.youtube.com/embed/3QhU9jd03a0' },
                        { title: 'Firewalls', duration: '35 min', preview: false, videoUrl: 'https://www.youtube.com/embed/AgHghB4f0zM' }
                    ]
                },
                {
                    title: 'Ethical Hacking',
                    lessons: [
                        { title: 'Penetration Testing', duration: '42 min', preview: false, videoUrl: 'https://www.youtube.com/embed/3Kq1MIfTWCE' }
                    ]
                }
            ]
        }
    ];

    const courses = [];
    for (const courseData of coursesData) {
        const { sections, ...data } = courseData;
        const course = await prisma.course.create({
            data: {
                ...data,
                sections: {
                    create: sections.map((section, idx) => ({
                        title: section.title,
                        order: idx + 1,
                        lessons: {
                            create: section.lessons.map((lesson, lIdx) => ({
                                ...lesson,
                                order: lIdx + 1
                            }))
                        }
                    }))
                }
            },
            include: {
                sections: {
                    include: { lessons: true }
                }
            }
        });
        courses.push(course);
    }

    console.log('✅ Created Courses');
    // Create a weekly quiz
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
    console.log('✅ Created weekly quiz');

    // 3. Create Students (Batch)
    console.log('Creating 1600 students...');
    const studentsBatch = [];
    for (let i = 0; i < 1600; i++) {
        studentsBatch.push({
            email: `student${i}@edumaster.com`,
            password: hashedPassword,
            name: `Student ${i}`,
            role: 'STUDENT',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        });
    }
    await prisma.user.createMany({ data: studentsBatch });
    const allStudents = await prisma.user.findMany({ where: { role: 'STUDENT' } });

    console.log('✅ Created 1600 Students');

    // 4. Enrollments
    // Target counts:
    // React (courses[0]): 1247
    // Node (courses[1]): 892
    // Data Science (courses[2]): 1534
    // DevOps (courses[3]): 678
    // Cyber (courses[4]): 1023

    const enrollmentTargets = [
        { course: courses[0], count: 1247 },
        { course: courses[1], count: 892 },
        { course: courses[2], count: 1534 },
        { course: courses[3], count: 678 },
        { course: courses[4], count: 1023 }
    ];

    const enrollments = [];
    for (const target of enrollmentTargets) {
        // Randomly select 'count' students
        // To be fast, we just take the first 'count' students, or shuffle if needed.
        // Let's just take the first N for simplicity, or offset them to distribute.
        // Actually, let's shuffle indices to make it random.

        // Simple shuffle of indices
        const indices = Array.from({ length: allStudents.length }, (_, i) => i);
        // Fisher-Yates shuffle (partial)
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const selectedIndices = indices.slice(0, target.count);

        for (const idx of selectedIndices) {
            const student = allStudents[idx];
            const progress = Math.floor(Math.random() * 101); // 0-100
            const completed = progress === 100;

            enrollments.push({
                userId: student.id,
                courseId: target.course.id,
                progress: progress,
                paid: true,
                paymentAmount: target.course.price,
                paymentDate: new Date(2024, 10, Math.floor(Math.random() * 25) + 1),
                completedAt: completed ? new Date(2024, 10, Math.floor(Math.random() * 25) + 1) : null
            });
        }
    }

    // Batch create enrollments
    // Prisma createMany for enrollments
    // We need to chunk it because there might be too many parameters
    const chunkSize = 1000;
    for (let i = 0; i < enrollments.length; i += chunkSize) {
        const chunk = enrollments.slice(i, i + chunkSize);
        await prisma.enrollment.createMany({ data: chunk });
    }

    console.log('✅ Created Enrollments');

    // 5. Quizzes
    const quizDefinitions = [
        {
            courseIdx: 0,
            title: 'React Fundamentals Quiz',
            questions: [
                { q: 'What is React?', options: ['Library', 'Framework', 'Language', 'Database'], correct: 'Library', type: 'MCQ' },
                { q: 'JSX stands for?', options: ['JavaScript XML', 'Java Syntax', 'JSON X', 'None'], correct: 'JavaScript XML', type: 'MCQ' },
                { q: 'Hook for state?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correct: 'useState', type: 'MCQ' },
                { q: 'Fill in: The ___ hook handles side effects.', options: ['useEffect'], correct: 'useEffect', type: 'FILL' }
            ]
        },
        {
            courseIdx: 1,
            title: 'Node.js Basics Quiz',
            questions: [
                { q: 'Node.js is based on?', options: ['V8', 'SpiderMonkey', 'Chakra', 'None'], correct: 'V8', type: 'MCQ' },
                { q: 'Default package manager?', options: ['npm', 'yarn', 'pnpm', 'bower'], correct: 'npm', type: 'MCQ' },
                { q: 'Fill in: ___ is a popular web framework for Node.', options: ['Express'], correct: 'Express', type: 'FILL' }
            ]
        },
        {
            courseIdx: 2,
            title: 'Data Science Fundamentals',
            questions: [
                { q: 'Library for data manipulation?', options: ['Pandas', 'NumPy', 'Matplotlib', 'Scikit'], correct: 'Pandas', type: 'MCQ' },
                { q: 'Fill in: ___ is used for numerical computing.', options: ['NumPy'], correct: 'NumPy', type: 'FILL' },
                { q: 'Supervised learning uses?', options: ['Labeled data', 'Unlabeled data', 'Rewards', 'None'], correct: 'Labeled data', type: 'MCQ' }
            ]
        },
        {
            courseIdx: 3,
            title: 'DevOps & Docker Quiz',
            questions: [
                { q: 'Tool for containerization?', options: ['Docker', 'Kubernetes', 'Jenkins', 'Git'], correct: 'Docker', type: 'MCQ' },
                { q: 'Fill in: ___ is a container orchestration tool.', options: ['Kubernetes'], correct: 'Kubernetes', type: 'FILL' },
                { q: 'CI/CD stands for?', options: ['Continuous Integration/Continuous Deployment', 'Code Integration', 'None', 'All'], correct: 'Continuous Integration/Continuous Deployment', type: 'MCQ' }
            ]
        },
        {
            courseIdx: 4,
            title: 'Cybersecurity Basics',
            questions: [
                { q: 'Protocol for secure web browsing?', options: ['HTTPS', 'HTTP', 'FTP', 'SMTP'], correct: 'HTTPS', type: 'MCQ' },
                { q: 'Fill in: A ___ protects a network from unauthorized access.', options: ['Firewall'], correct: 'Firewall', type: 'FILL' },
                { q: 'Ethical hacking is also known as?', options: ['White hat', 'Black hat', 'Grey hat', 'Red hat'], correct: 'White hat', type: 'MCQ' }
            ]
        }
        // Add more quizzes for other courses if needed, but this is enough for demo
    ];

    const createdQuizzes = [];
    for (const def of quizDefinitions) {
        const quiz = await prisma.quiz.create({
            data: {
                title: def.title,
                description: 'Test your knowledge',
                type: 'COURSE',
                courseId: courses[def.courseIdx].id,
                questions: {
                    create: def.questions.map((q, i) => ({
                        question: q.q,
                        options: q.type === 'MCQ' ? q.options : [],
                        correctAnswer: q.correct,
                        points: 10,
                        order: i + 1
                    }))
                }
            },
            include: { questions: true }
        });
        createdQuizzes.push(quiz);
    }

    // 6. Attempts (Leaderboard)
    // Let's have top 50 students take quizzes
    const attempts = [];
    for (let i = 0; i < 50; i++) {
        const student = allStudents[i];
        for (const quiz of createdQuizzes) {
            if (Math.random() > 0.3) { // 70% chance to take quiz
                const score = Math.floor(Math.random() * 30) + 10; // 10-40 points
                attempts.push({
                    userId: student.id,
                    quizId: quiz.id,
                    score: score,
                    answers: {},
                    submittedAt: new Date()
                });
            }
        }
    }
    await prisma.attempt.createMany({ data: attempts });

    console.log('✅ Created Quizzes and Attempts');

    // 7. Reviews
    const reviews = [];
    for (let i = 0; i < 20; i++) {
        const student = allStudents[i];
        const course = courses[i % 5];
        reviews.push({
            userId: student.id,
            courseId: course.id,
            rating: 4 + (i % 2), // 4 or 5
            comment: 'Great course! Highly recommended.'
        });
    }
    await prisma.review.createMany({ data: reviews });

    console.log('✅ Created Reviews');
    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
