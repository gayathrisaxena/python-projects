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

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin
    const admin = await prisma.user.create({
        data: {
            email: 'admin@edumaster.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
            avatar: 'AU',
        },
    });

    // Create Instructors
    const instructors = await Promise.all([
        prisma.user.create({
            data: {
                email: 'john@edumaster.com',
                password: hashedPassword,
                name: 'Dr. John Anderson',
                role: 'INSTRUCTOR',
                avatar: 'JA',
                bio: 'Senior Full Stack Developer with 12+ years of experience. Former Tech Lead at Google. Passionate about teaching modern web development.',
            },
        }),
        prisma.user.create({
            data: {
                email: 'sarah@edumaster.com',
                password: hashedPassword,
                name: 'Dr. Sarah Mitchell',
                role: 'INSTRUCTOR',
                avatar: 'SM',
                bio: 'Data Science Expert and ML Researcher. PhD in Computer Science from MIT. Published 50+ research papers in AI/ML.',
            },
        }),
        prisma.user.create({
            data: {
                email: 'mike@edumaster.com',
                password: hashedPassword,
                name: 'Michael Chen',
                role: 'INSTRUCTOR',
                avatar: 'MC',
                bio: 'DevOps Architect and Cloud Solutions Expert. AWS Certified Solutions Architect. 15 years in enterprise infrastructure.',
            },
        }),
        prisma.user.create({
            data: {
                email: 'emily@edumaster.com',
                password: hashedPassword,
                name: 'Emily Rodriguez',
                role: 'INSTRUCTOR',
                avatar: 'ER',
                bio: 'Cybersecurity Specialist and Ethical Hacker. CISSP certified. Former security consultant for Fortune 500 companies.',
            },
        }),
    ]);

    // Create Students (30 students for realistic leaderboard)
    const studentNames = [
        'Alex Thompson', 'Priya Sharma', 'James Wilson', 'Maria Garcia', 'David Lee',
        'Sophie Chen', 'Ryan Patel', 'Emma Johnson', 'Lucas Brown', 'Olivia Davis',
        'Noah Martinez', 'Ava Anderson', 'Ethan Taylor', 'Isabella Thomas', 'Mason White',
        'Mia Harris', 'Logan Clark', 'Charlotte Lewis', 'Jacob Walker', 'Amelia Hall',
        'William Allen', 'Harper Young', 'Benjamin King', 'Evelyn Wright', 'Elijah Lopez',
        'Abigail Hill', 'Oliver Scott', 'Emily Green', 'Alexander Adams', 'Sofia Baker'
    ];

    const students = await Promise.all(
        studentNames.map((name, index) =>
            prisma.user.create({
                data: {
                    email: `student${index + 1}@example.com`,
                    password: hashedPassword,
                    name: name,
                    role: 'STUDENT',
                    avatar: name.split(' ').map(n => n[0]).join(''),
                },
            })
        )
    );

    console.log('✅ Created users (admin, instructors, students)');

    // Create Courses with realistic data
    const reactCourse = await prisma.course.create({
        data: {
            title: 'Complete React Developer Course 2024',
            slug: 'complete-react-developer-2024',
            description: 'Master React.js from fundamentals to advanced concepts. Build real-world projects and become job-ready.',
            longDescription: 'This comprehensive React course covers everything from JSX basics to advanced hooks, state management with Redux, testing, and deployment. You\'ll build 5 real-world projects including an e-commerce platform and social media app.',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
            price: 1999,
            level: 'BEGINNER',
            category: 'Web Development',
            published: true,
            instructorId: instructors[0].id,
            sections: {
                create: [
                    {
                        title: 'Getting Started with React',
                        order: 1,
                        lessons: {
                            create: [
                                {
                                    title: 'Introduction to React and Modern JavaScript',
                                    description: 'Understand what React is, why it\'s popular, and ES6+ features you need to know.',
                                    videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM',
                                    duration: '18 min',
                                    order: 1,
                                    preview: true,
                                },
                                {
                                    title: 'Setting Up Your Development Environment',
                                    description: 'Install Node.js, npm, VS Code extensions, and create your first React app with Vite.',
                                    videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
                                    duration: '22 min',
                                    order: 2,
                                    preview: true,
                                },
                                {
                                    title: 'Understanding JSX and Components',
                                    description: 'Learn JSX syntax, component structure, and how React renders elements.',
                                    videoUrl: 'https://www.youtube.com/embed/Y6aYx_KKM7A',
                                    duration: '28 min',
                                    order: 3,
                                    preview: false,
                                },
                            ],
                        },
                    },
                    {
                        title: 'React Fundamentals',
                        order: 2,
                        lessons: {
                            create: [
                                {
                                    title: 'Props and Component Communication',
                                    description: 'Master props, prop types, and parent-child component communication.',
                                    videoUrl: 'https://www.youtube.com/embed/m7OWXtbiXX8',
                                    duration: '32 min',
                                    order: 1,
                                    preview: false,
                                },
                                {
                                    title: 'State Management with useState Hook',
                                    description: 'Learn state management, event handling, and controlled components.',
                                    videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0',
                                    duration: '38 min',
                                    order: 2,
                                    preview: false,
                                },
                                {
                                    title: 'useEffect Hook and Side Effects',
                                    description: 'Handle side effects, API calls, and component lifecycle with useEffect.',
                                    videoUrl: 'https://www.youtube.com/embed/0ZJgIjIuY7U',
                                    duration: '42 min',
                                    order: 3,
                                    preview: false,
                                },
                            ],
                        },
                    },
                    {
                        title: 'Advanced React Patterns',
                        order: 3,
                        lessons: {
                            create: [
                                {
                                    title: 'Context API and Global State',
                                    description: 'Manage global state without prop drilling using Context API.',
                                    videoUrl: 'https://www.youtube.com/embed/5LrDIWkK_Bc',
                                    duration: '35 min',
                                    order: 1,
                                    preview: false,
                                },
                                {
                                    title: 'Custom Hooks and Code Reusability',
                                    description: 'Create reusable logic with custom hooks.',
                                    videoUrl: 'https://www.youtube.com/embed/6ThXsUwLWvc',
                                    duration: '30 min',
                                    order: 2,
                                    preview: false,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });

    const nodeCourse = await prisma.course.create({
        data: {
            title: 'Node.js & Express - Complete Backend Bootcamp',
            slug: 'nodejs-express-backend-bootcamp',
            description: 'Build scalable backend applications with Node.js, Express, MongoDB, and RESTful APIs.',
            longDescription: 'Learn professional backend development from scratch. Master Node.js fundamentals, Express framework, MongoDB database, authentication, security, testing, and deployment to production.',
            thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop',
            price: 2499,
            level: 'INTERMEDIATE',
            category: 'Web Development',
            published: true,
            instructorId: instructors[0].id,
            sections: {
                create: [
                    {
                        title: 'Node.js Fundamentals',
                        order: 1,
                        lessons: {
                            create: [
                                {
                                    title: 'Understanding Node.js and Event Loop',
                                    description: 'Deep dive into Node.js architecture and asynchronous programming.',
                                    videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ',
                                    duration: '35 min',
                                    order: 1,
                                    preview: true,
                                },
                                {
                                    title: 'Working with Modules and NPM',
                                    description: 'Learn module system, package management, and dependency handling.',
                                    videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4',
                                    duration: '28 min',
                                    order: 2,
                                    preview: true,
                                },
                                {
                                    title: 'File System and Streams',
                                    description: 'Handle files efficiently using streams and buffers.',
                                    videoUrl: 'https://www.youtube.com/embed/GlybFFMXXmQ',
                                    duration: '40 min',
                                    order: 3,
                                    preview: false,
                                },
                            ],
                        },
                    },
                    {
                        title: 'Building REST APIs with Express',
                        order: 2,
                        lessons: {
                            create: [
                                {
                                    title: 'Express.js Basics and Routing',
                                    description: 'Set up Express server, routing, and middleware.',
                                    videoUrl: 'https://www.youtube.com/embed/L72fhGm1tfE',
                                    duration: '38 min',
                                    order: 1,
                                    preview: false,
                                },
                                {
                                    title: 'MongoDB Integration and Mongoose',
                                    description: 'Connect to MongoDB, create schemas, and perform CRUD operations.',
                                    videoUrl: 'https://www.youtube.com/embed/DZBGEVgL2eE',
                                    duration: '45 min',
                                    order: 2,
                                    preview: false,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });

    const dataScienceCourse = await prisma.course.create({
        data: {
            title: 'Data Science & Machine Learning with Python',
            slug: 'data-science-ml-python',
            description: 'Complete data science course covering Python, pandas, NumPy, visualization, and machine learning algorithms.',
            longDescription: 'Become a data scientist! Learn Python programming, data analysis with pandas, data visualization, statistics, and machine learning. Build real projects and create a professional portfolio.',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
            price: 2999,
            level: 'BEGINNER',
            category: 'Data Science',
            published: true,
            instructorId: instructors[1].id,
            sections: {
                create: [
                    {
                        title: 'Python for Data Science',
                        order: 1,
                        lessons: {
                            create: [
                                {
                                    title: 'Python Fundamentals for Data Science',
                                    description: 'Master Python basics: variables, data types, loops, and functions.',
                                    videoUrl: 'https://www.youtube.com/embed/LHBE6Q9XlzI',
                                    duration: '42 min',
                                    order: 1,
                                    preview: true,
                                },
                                {
                                    title: 'NumPy for Numerical Computing',
                                    description: 'Learn array operations, broadcasting, and vectorization.',
                                    videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI',
                                    duration: '38 min',
                                    order: 2,
                                    preview: true,
                                },
                                {
                                    title: 'Pandas for Data Manipulation',
                                    description: 'Master DataFrames, data cleaning, and transformation.',
                                    videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
                                    duration: '50 min',
                                    order: 3,
                                    preview: false,
                                },
                            ],
                        },
                    },
                    {
                        title: 'Machine Learning Fundamentals',
                        order: 2,
                        lessons: {
                            create: [
                                {
                                    title: 'Introduction to Machine Learning',
                                    description: 'Understand ML concepts, types, and applications.',
                                    videoUrl: 'https://www.youtube.com/embed/7eh4d6sabA0',
                                    duration: '32 min',
                                    order: 1,
                                    preview: false,
                                },
                                {
                                    title: 'Linear Regression and Model Evaluation',
                                    description: 'Build your first ML model and evaluate performance.',
                                    videoUrl: 'https://www.youtube.com/embed/nk2CQITm_eY',
                                    duration: '45 min',
                                    order: 2,
                                    preview: false,
                                },
                                {
                                    title: 'Classification Algorithms',
                                    description: 'Learn logistic regression, decision trees, and random forests.',
                                    videoUrl: 'https://www.youtube.com/embed/zM4VZR0px8E',
                                    duration: '48 min',
                                    order: 3,
                                    preview: false,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });

    const devOpsCourse = await prisma.course.create({
        data: {
            title: 'DevOps Engineering - Docker, Kubernetes & CI/CD',
            slug: 'devops-docker-kubernetes-cicd',
            description: 'Master DevOps practices, containerization, orchestration, and automated deployment pipelines.',
            longDescription: 'Learn industry-standard DevOps tools and practices. Master Docker, Kubernetes, Jenkins, GitHub Actions, monitoring, and cloud deployment on AWS.',
            thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop',
            price: 3499,
            level: 'ADVANCED',
            category: 'DevOps',
            published: true,
            instructorId: instructors[2].id,
            sections: {
                create: [
                    {
                        title: 'Containerization with Docker',
                        order: 1,
                        lessons: {
                            create: [
                                {
                                    title: 'Docker Fundamentals',
                                    description: 'Understand containers, images, and Docker architecture.',
                                    videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo',
                                    duration: '35 min',
                                    order: 1,
                                    preview: true,
                                },
                                {
                                    title: 'Docker Compose and Multi-Container Apps',
                                    description: 'Orchestrate multiple containers with Docker Compose.',
                                    videoUrl: 'https://www.youtube.com/embed/HB9V6PZcU7c',
                                    duration: '40 min',
                                    order: 2,
                                    preview: false,
                                },
                            ],
                        },
                    },
                    {
                        title: 'Kubernetes Orchestration',
                        order: 2,
                        lessons: {
                            create: [
                                {
                                    title: 'Kubernetes Architecture and Concepts',
                                    description: 'Learn pods, services, deployments, and namespaces.',
                                    videoUrl: 'https://www.youtube.com/embed/X48VuDVv0do',
                                    duration: '45 min',
                                    order: 1,
                                    preview: false,
                                },
                                {
                                    title: 'CI/CD with GitHub Actions',
                                    description: 'Automate testing and deployment workflows.',
                                    videoUrl: 'https://www.youtube.com/embed/R8_veQiYBjI',
                                    duration: '38 min',
                                    order: 2,
                                    preview: false,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });

    const cyberSecurityCourse = await prisma.course.create({
        data: {
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
            sections: {
                create: [
                    {
                        title: 'Network Security Basics',
                        order: 1,
                        lessons: {
                            create: [
                                {
                                    title: 'Understanding Network Protocols',
                                    description: 'Learn TCP/IP, DNS, HTTP/HTTPS, and network fundamentals.',
                                    videoUrl: 'https://www.youtube.com/embed/3QhU9jd03a0',
                                    duration: '30 min',
                                    order: 1,
                                    preview: true,
                                },
                                {
                                    title: 'Firewalls and Network Defense',
                                    description: 'Configure firewalls, VPNs, and implement security policies.',
                                    videoUrl: 'https://www.youtube.com/embed/AgHghB4f0zM',
                                    duration: '35 min',
                                    order: 2,
                                    preview: false,
                                },
                            ],
                        },
                    },
                    {
                        title: 'Ethical Hacking Techniques',
                        order: 2,
                        lessons: {
                            create: [
                                {
                                    title: 'Penetration Testing Methodology',
                                    description: 'Learn reconnaissance, scanning, and exploitation phases.',
                                    videoUrl: 'https://www.youtube.com/embed/3Kq1MIfTWCE',
                                    duration: '42 min',
                                    order: 1,
                                    preview: false,
                                },
                            ],
                        },
                    },
                ],
            },
            include: {
                lessons: true
            }
        }
    }
    });

// Create comprehensive quizzes for each course (MCQ + Fill in the blanks)
const quizData = [
    // React Course Quizzes
    {
        course: reactCourse,
        quizzes: [
            {
                title: 'React Fundamentals Quiz',
                description: 'Test your understanding of React basics',
                type: 'COURSE',
                courseId: reactCourse.id,
                questions: [
                    {
                        question: 'What is React primarily used for?',
                        options: ['Building User Interfaces', 'Database Management', 'Server-side Logic', 'Operating Systems'],
                        correctAnswer: 'Building User Interfaces',
                        points: 10,
                        order: 1
                    },
                    {
                        question: 'Which company developed and maintains React?',
                        options: ['Google', 'Meta (Facebook)', 'Amazon', 'Microsoft'],
                        correctAnswer: 'Meta (Facebook)',
                        points: 10,
                        order: 2
                    },
                    {
                        question: 'What does JSX stand for?',
                        options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Xylophone', 'JavaScript X-factor'],
                        correctAnswer: 'JavaScript XML',
                        points: 10,
                        order: 3
                    },
                    {
                        question: 'Fill in the blank: The _____ hook is used to manage state in functional components.',
                        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
                        correctAnswer: 'useState',
                        points: 15,
                        order: 4
                    },
                    {
                        question: 'Fill in the blank: To handle side effects in React, we use the _____ hook.',
                        options: ['useEffect', 'useState', 'useMemo', 'useCallback'],
                        correctAnswer: 'useEffect',
                        points: 15,
                        order: 5
                    },
                ]
            },
            {
                title: 'React Hooks Mastery',
                description: 'Advanced quiz on React Hooks',
                type: 'COURSE',
                courseId: reactCourse.id,
                questions: [
                    {
                        question: 'Which hook is used for performance optimization by memoizing values?',
                        options: ['useMemo', 'useCallback', 'useEffect', 'useState'],
                        correctAnswer: 'useMemo',
                        points: 10,
                        order: 1
                    },
                    {
                        question: 'Fill in the blank: The _____ hook is used to access context values.',
                        options: ['useContext', 'useState', 'useEffect', 'useReducer'],
                        correctAnswer: 'useContext',
                        points: 15,
                        order: 2
                    },
                ]
            }
        ]
    },
    // Node.js Course Quizzes
    {
        course: nodeCourse,
        quizzes: [
            {
                title: 'Node.js Fundamentals Assessment',
                description: 'Test your Node.js knowledge',
                type: 'COURSE',
                courseId: nodeCourse.id,
                questions: [
                    {
                        question: 'What is Node.js built on?',
                        options: ['V8 JavaScript Engine', 'SpiderMonkey', 'Chakra', 'JavaScriptCore'],
                        correctAnswer: 'V8 JavaScript Engine',
                        points: 10,
                        order: 1
                    },
                    {
                        question: 'Which of the following is NOT a core module in Node.js?',
                        options: ['express', 'fs', 'http', 'path'],
                        correctAnswer: 'express',
                        points: 10,
                        order: 2
                    },
                    {
                        question: 'Fill in the blank: NPM stands for Node _____ Manager.',
                        options: ['Package', 'Program', 'Project', 'Process'],
                        correctAnswer: 'Package',
                        points: 15,
                        order: 3
                    },
                    {
                        question: 'Fill in the blank: The _____ loop is the heart of Node.js asynchronous architecture.',
                        options: ['event', 'async', 'callback', 'promise'],
                        correctAnswer: 'event',
                        points: 15,
                        order: 4
                    },
                ]
            },
            {
                title: 'Express.js & REST APIs Quiz',
                description: 'Test your Express knowledge',
                type: 'COURSE',
                courseId: nodeCourse.id,
                questions: [
                    {
                        question: 'What HTTP method is used to retrieve data?',
                        options: ['GET', 'POST', 'PUT', 'DELETE'],
                        correctAnswer: 'GET',
                        points: 10,
                        order: 1
                    },
                    {
                        question: 'Fill in the blank: Middleware functions have access to the request, response, and _____ function.',
                        options: ['next', 'callback', 'done', 'continue'],
                        correctAnswer: 'next',
                        points: 15,
                        order: 2
                    },
                ]
            }
        ]
    },
    // Data Science Course Quizzes
    {
        course: dataScienceCourse,
        quizzes: [
            {
                title: 'Python & Data Analysis Quiz',
                description: 'Test your Python and pandas knowledge',
                type: 'COURSE',
                courseId: dataScienceCourse.id,
                questions: [
                    {
                        question: 'Which library is primarily used for data manipulation in Python?',
                        options: ['pandas', 'numpy', 'matplotlib', 'scikit-learn'],
                        correctAnswer: 'pandas',
                        points: 10,
                        order: 1
                    },
                    {
                        question: 'What is the main data structure in pandas?',
                        options: ['DataFrame', 'Array', 'List', 'Dictionary'],
                        correctAnswer: 'DataFrame',
                        points: 10,
                        order: 2
                    },
                    {
                        question: 'Fill in the blank: _____ is used for numerical computing in Python.',
                        options: ['NumPy', 'pandas', 'matplotlib', 'seaborn'],
                        correctAnswer: 'NumPy',
                        points: 15,
                        order: 3
                    },
                ]
            },
            {
                title: 'Machine Learning Concepts',
                description: 'Test your ML understanding',
                type: 'COURSE',
                courseId: dataScienceCourse.id,
                questions: [
                    {
                        question: 'Which algorithm is used for regression problems?',
                        options: ['Linear Regression', 'K-Means', 'Decision Tree (Classification)', 'Naive Bayes'],
                        correctAnswer: 'Linear Regression',
                        points: 10,
                        order: 1
                    },
                    {
                        question: 'Fill in the blank: _____ learning involves training with labeled data.',
                        options: ['Supervised', 'Unsupervised', 'Reinforcement', 'Transfer'],
                        correctAnswer: 'Supervised',
                        points: 15,
                        order: 2
                    },
                ]
            }
        ]
    },
    // DevOps Course Quizzes
    {
        course: devOpsCourse,
        quizzes: [
            {
                title: 'Docker & Containerization Quiz',
                description: 'Test your Docker knowledge',
                type: 'COURSE',
                courseId: devOpsCourse.id,
                questions: [
                    {
                        question: 'What is a Docker container?',
                        options: ['A lightweight, standalone executable package', 'A virtual machine', 'A programming language', 'A database'],
                        correctAnswer: 'A lightweight, standalone executable package',
                        points: 10,
                        order: 1
                    },
                    {
                        question: 'Fill in the blank: A _____ is a blueprint for creating Docker containers.',
                        options: ['image', 'volume', 'network', 'registry'],
                        correctAnswer: 'image',
                        points: 15,
                        order: 2
                    },
                    {
                        question: 'Which file is used to define multi-container Docker applications?',
                        options: ['docker-compose.yml', 'Dockerfile', 'package.json', 'config.json'],
                        correctAnswer: 'docker-compose.yml',
                        points: 10,
                        order: 3
                    },
                ]
            },
            {
                title: 'Kubernetes Fundamentals',
                description: 'Test your Kubernetes knowledge',
                type: 'COURSE',
                courseId: devOpsCourse.id,
                questions: [
                    {
                        question: 'What is the smallest deployable unit in Kubernetes?',
                        options: ['Pod', 'Container', 'Node', 'Cluster'],
                        correctAnswer: 'Pod',
                        points: 10,
                        order: 1
                    },
                    {
                        question: 'Fill in the blank: _____ is used to expose pods to external traffic in Kubernetes.',
                        options: ['Service', 'Deployment', 'ConfigMap', 'Secret'],
                        correctAnswer: 'Service',
                        points: 15,
                        order: 2
                    },
                ]
            }
        ]
    },
    // Cybersecurity Course Quizzes
    {
        course: cyberSecurityCourse,
        quizzes: [
            {
                title: 'Network Security Fundamentals',
                description: 'Test your network security knowledge',
                type: 'COURSE',
                courseId: cyberSecurityCourse.id,
                questions: [
                    {
                        question: 'What does HTTPS stand for?',
                        options: ['HyperText Transfer Protocol Secure', 'High Transfer Protocol System', 'HyperText Transmission Protocol Secure', 'High Text Transfer Protocol Secure'],
                        correctAnswer: 'HyperText Transfer Protocol Secure',
                        points: 10,
                        order: 1
                    },
                    {
                        question: 'Fill in the blank: A _____ is a network security system that monitors and controls incoming and outgoing traffic.',
                        options: ['firewall', 'router', 'switch', 'modem'],
                        correctAnswer: 'firewall',
                        points: 15,
                        order: 2
                    },
                    {
                        question: 'Which port is commonly used for HTTPS?',
                        options: ['443', '80', '22', '3306'],
                        correctAnswer: '443',
                        points: 10,
                        order: 3
                    },
                ]
            },
            {
                title: 'Ethical Hacking Basics',
                description: 'Test your ethical hacking knowledge',
                type: 'COURSE',
                courseId: cyberSecurityCourse.id,
                questions: [
                    {
                        question: 'What is the first phase of penetration testing?',
                        options: ['Reconnaissance', 'Exploitation', 'Scanning', 'Reporting'],
                        correctAnswer: 'Reconnaissance',
                        points: 10,
                        order: 1
                    },
                    {
                        question: 'Fill in the blank: _____ testing involves testing without any prior knowledge of the system.',
                        options: ['Black box', 'White box', 'Gray box', 'Clear box'],
                        correctAnswer: 'Black box',
                        points: 15,
                        order: 2
                    },
                ]
            }
        ]
    }
];

// Create all quizzes with questions
for (const courseQuizData of quizData) {
    for (const quizInfo of courseQuizData.quizzes) {
        await prisma.quiz.create({
            data: {
                title: quizInfo.title,
                description: quizInfo.description,
                type: quizInfo.type,
                courseId: quizInfo.courseId,
                passingScore: 70,
                questions: {
                    create: quizInfo.questions
                }
            }
        });
    }
}

console.log('✅ Created comprehensive quizzes with MCQ and fill-in-the-blank questions');

// Create quiz attempts for leaderboard (realistic scores)
const allQuizzes = await prisma.quiz.findMany({
    include: { questions: true }
});

const attemptData = [];
students.forEach((student, studentIdx) => {
    // Each student attempts 2-5 random quizzes
    const numAttempts = Math.floor(Math.random() * 4) + 2;
    const attemptedQuizzes = allQuizzes
        .sort(() => 0.5 - Math.random())
        .slice(0, numAttempts);

    attemptedQuizzes.forEach(quiz => {
        const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
        // Generate realistic scores (60-100)
        const scorePercentage = Math.random() * 0.4 + 0.6; // 60% to 100%
        const score = Math.floor(totalPoints * scorePercentage);

        attemptData.push({
            userId: student.id,
            quizId: quiz.id,
            score: score,
            answers: {},
            submittedAt: new Date(2024, 10, Math.floor(Math.random() * 25) + 1)
        });
    });
});

await prisma.attempt.createMany({ data: attemptData });
console.log('✅ Created quiz attempts for leaderboard');

// Create reviews
const reviewData = [
    {
        courseId: reactCourse.id,
        userId: students[0].id,
        rating: 5,
        comment: 'Excellent course! The instructor explains everything clearly and the projects are very practical.'
    },
    {
        courseId: reactCourse.id,
        userId: students[1].id,
        rating: 5,
        comment: 'Best React course I\'ve taken. Went from beginner to building real applications!'
    },
    {
        courseId: nodeCourse.id,
        userId: students[2].id,
        rating: 5,
        comment: 'Great backend course. Learned so much about Node.js and Express.'
    },
    {
        courseId: dataScienceCourse.id,
        userId: students[3].id,
        rating: 5,
        comment: 'Perfect for beginners! The ML concepts are explained very well.'
    },
    {
        courseId: devOpsCourse.id,
        userId: students[4].id,
        rating: 4,
        comment: 'Comprehensive DevOps course. Docker and Kubernetes sections are excellent.'
    },
];

await prisma.review.createMany({ data: reviewData });
console.log('✅ Created reviews');

console.log('🎉 Comprehensive database seed completed successfully!');
console.log('\n📊 Summary:');
console.log('- 1 Admin');
console.log('- 4 Instructors');
console.log('- 30 Students');
console.log('- 5 Courses with realistic enrollment numbers');
console.log('- Multiple sections and lessons per course');
console.log('- Comprehensive quizzes (MCQ + Fill in the blanks)');
console.log('- Realistic quiz attempts for leaderboard');
console.log('- Course reviews');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
