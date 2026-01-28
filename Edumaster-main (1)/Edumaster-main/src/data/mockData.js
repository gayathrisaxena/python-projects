// Comprehensive mock data for EduMaster

export const mockData = {
    // Categories
    categories: [
        { id: 1, name: 'Web Development', icon: 'Code', count: 45 },
        { id: 2, name: 'Data Science', icon: 'Database', count: 32 },
        { id: 3, name: 'DevOps', icon: 'Server', count: 18 },
        { id: 4, name: 'Design', icon: 'Palette', count: 28 },
        { id: 5, name: 'Mobile Development', icon: 'Smartphone', count: 22 },
        { id: 6, name: 'Cloud Computing', icon: 'Cloud', count: 15 },
    ],

    // Instructors
    instructors: [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@instructor.test',
            bio: '8 years of experience in full-stack development. Former senior engineer at Google.',
            avatar: 'JD',
            rating: 4.9,
            students: 12450,
            courses: 23,
            expertise: ['React', 'Node.js', 'TypeScript'],
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@instructor.test',
            bio: 'Data Science expert with PhD from MIT. Published author and conference speaker.',
            avatar: 'JS',
            rating: 4.8,
            students: 8960,
            courses: 15,
            expertise: ['Python', 'Machine Learning', 'TensorFlow'],
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike@instructor.test',
            bio: 'DevOps architect with 10+ years experience. AWS certified solutions architect.',
            avatar: 'MJ',
            rating: 4.7,
            students: 6780,
            courses: 12,
            expertise: ['Docker', 'Kubernetes', 'AWS'],
        },
    ],

    // Courses
    courses: [
        {
            id: 1,
            slug: 'introduction-to-react',
            title: 'Introduction to React',
            instructor: 'John Doe',
            instructorId: 1,
            category: 'Web Development',
            level: 'Beginner',
            price: 1999,
            description: 'Learn the fundamentals of React and build modern web applications.',
            longDescription: 'Master React from scratch! This course will take you from zero to hero in React development. You\'ll learn components, hooks, state management, routing, and much more.',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
            lessons: 20,
            duration: '10 hours',
            students: 2100,
            rating: 4.8,
            reviews: 342,
            lastUpdated: '2024-01-15',
            language: 'English',
            certificate: true,
            syllabus: [
                {
                    section: 'Getting Started',
                    lessons: [
                        {
                            id: 1,
                            title: 'Introduction to React',
                            duration: '15 min',
                            preview: true,
                            videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
                            description: 'Learn what React is and why you should use it'
                        },
                        {
                            id: 2,
                            title: 'Setting Up Development Environment',
                            duration: '20 min',
                            preview: true,
                            videoUrl: 'https://www.youtube.com/embed/QFaFIcGhPoM',
                            description: 'Set up your development environment with Node.js and VS Code'
                        },
                        {
                            id: 3,
                            title: 'Your First React Component',
                            duration: '25 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
                            description: 'Create your first React component and understand JSX'
                        },
                    ]
                },
                {
                    section: 'Core Concepts',
                    lessons: [
                        {
                            id: 4,
                            title: 'Components and Props',
                            duration: '30 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/m7OWXtbiXX8',
                            description: 'Understanding components and how to pass data with props'
                        },
                        {
                            id: 5,
                            title: 'State and Lifecycle',
                            duration: '35 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0',
                            description: 'Learn about component state and lifecycle methods'
                        },
                        {
                            id: 6,
                            title: 'Handling Events',
                            duration: '25 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/Znqv84xi8Vs',
                            description: 'Handle user interactions and events in React'
                        },
                    ]
                },
                {
                    section: 'Advanced Topics',
                    lessons: [
                        {
                            id: 7,
                            title: 'Hooks Deep Dive',
                            duration: '40 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q',
                            description: 'Master React Hooks: useState, useEffect, and more'
                        },
                        {
                            id: 8,
                            title: 'Context API',
                            duration: '30 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/5LrDIWkK_Bc',
                            description: 'Manage global state with Context API'
                        },
                        {
                            id: 9,
                            title: 'React Router',
                            duration: '35 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/Law7wfdg_ls',
                            description: 'Add routing to your React applications'
                        },
                        {
                            id: 10,
                            title: 'Final Project',
                            duration: '60 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/hQAHSlTtcmY',
                            description: 'Build a complete React application from scratch'
                        },
                    ]
                }
            ],
            requirements: ['Basic HTML, CSS, and JavaScript knowledge', 'A computer with internet connection'],
            whatYouWillLearn: [
                'Build modern React applications from scratch',
                'Understand React hooks and state management',
                'Create reusable components',
                'Implement routing with React Router',
                'Deploy React applications to production'
            ]
        },
        {
            id: 2,
            title: 'Advanced Node.js',
            slug: 'advanced-nodejs',
            instructor: 'Jane Smith',
            instructorId: 2,
            category: 'Web Development',
            level: 'Advanced',
            price: 2999,
            description: 'Master backend development with Node.js and Express. Build scalable APIs and microservices.',
            longDescription: 'Take your Node.js skills to the next level. Learn advanced patterns, performance optimization, security best practices, and microservices architecture.',
            thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop',
            lessons: 15,
            duration: '12 hours',
            students: 856,
            rating: 4.9,
            reviews: 198,
            lastUpdated: '2024-02-10',
            language: 'English',
            certificate: true,
            syllabus: [
                {
                    section: 'Advanced Concepts',
                    lessons: [
                        {
                            id: 1,
                            title: 'Event Loop Deep Dive',
                            duration: '30 min',
                            preview: true,
                            videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ',
                            description: 'Understanding the Node.js event loop and asynchronous programming'
                        },
                        {
                            id: 2,
                            title: 'Streams and Buffers',
                            duration: '35 min',
                            preview: true,
                            videoUrl: 'https://www.youtube.com/embed/GlybFFMXXmQ',
                            description: 'Working with streams and buffers for efficient data handling'
                        },
                        {
                            id: 3,
                            title: 'Building RESTful APIs',
                            duration: '40 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/fgTGADljAeg',
                            description: 'Create professional REST APIs with Express.js'
                        },
                    ]
                },
                {
                    section: 'Security & Authentication',
                    lessons: [
                        {
                            id: 4,
                            title: 'JWT Authentication',
                            duration: '35 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
                            description: 'Implement secure authentication with JSON Web Tokens'
                        },
                        {
                            id: 5,
                            title: 'Security Best Practices',
                            duration: '30 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/F-sFp_AvHc8',
                            description: 'Protect your Node.js applications from common vulnerabilities'
                        },
                    ]
                },
                {
                    section: 'Performance & Deployment',
                    lessons: [
                        {
                            id: 6,
                            title: 'Performance Optimization',
                            duration: '35 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/ol56smloW3M',
                            description: 'Optimize Node.js application performance'
                        },
                        {
                            id: 7,
                            title: 'Testing with Jest',
                            duration: '30 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/FgnxcUQ5vho',
                            description: 'Write comprehensive tests for your Node.js applications'
                        },
                        {
                            id: 8,
                            title: 'Deployment Strategies',
                            duration: '40 min',
                            preview: false,
                            videoUrl: 'https://www.youtube.com/embed/kR8jysf7Hl0',
                            description: 'Deploy Node.js applications to production environments'
                        },
                    ]
                }
            ],
            requirements: ['Intermediate JavaScript knowledge', 'Basic Node.js experience'],
            whatYouWillLearn: [
                'Advanced Node.js patterns and best practices',
                'Build scalable microservices',
                'Implement authentication and authorization',
                'Optimize Node.js performance',
                'Deploy to production environments'
            ]
        },
        {
            id: 3,
            title: 'Full Stack Development',
            slug: 'full-stack-dev',
            instructor: 'John Doe',
            instructorId: 1,
            category: 'Web Development',
            level: 'Intermediate',
            price: 4999,
            description: 'Complete guide to building full stack applications with React, Node.js, and MongoDB.',
            longDescription: 'Become a full-stack developer! Learn to build complete web applications from frontend to backend, including databases, authentication, and deployment.',
            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',
            lessons: 20,
            duration: '16 hours',
            students: 2100,
            rating: 4.7,
            reviews: 567,
            lastUpdated: '2024-01-20',
            language: 'English',
            certificate: true,
            syllabus: [
                {
                    section: 'Frontend Development',
                    lessons: [
                        { id: 1, title: 'React Fundamentals', duration: '45 min', preview: true, videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8', description: 'Build modern user interfaces with React' },
                        { id: 2, title: 'State Management with Redux', duration: '40 min', preview: true, videoUrl: 'https://www.youtube.com/embed/_shA5Xwe8_4', description: 'Manage application state with Redux' },
                        { id: 3, title: 'Styling with Tailwind CSS', duration: '30 min', preview: false, videoUrl: 'https://www.youtube.com/embed/UBOj6rqRUME', description: 'Create beautiful UIs with Tailwind CSS' },
                    ]
                },
                {
                    section: 'Backend Development',
                    lessons: [
                        { id: 4, title: 'Node.js & Express Setup', duration: '35 min', preview: false, videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE', description: 'Set up a Node.js backend with Express' },
                        { id: 5, title: 'Building REST APIs', duration: '50 min', preview: false, videoUrl: 'https://www.youtube.com/embed/0oXYLzuucwU', description: 'Create RESTful APIs for your application' },
                        { id: 6, title: 'MongoDB Integration', duration: '45 min', preview: false, videoUrl: 'https://www.youtube.com/embed/ofme2o29ngU', description: 'Connect and work with MongoDB database' },
                        { id: 7, title: 'User Authentication', duration: '40 min', preview: false, videoUrl: 'https://www.youtube.com/embed/Ud5xKCYQTjM', description: 'Implement secure user authentication' },
                        { id: 8, title: 'Deployment to Production', duration: '45 min', preview: false, videoUrl: 'https://www.youtube.com/embed/l134cBAJCuc', description: 'Deploy your full stack application' },
                    ]
                }
            ],
            requirements: ['HTML, CSS, JavaScript basics', 'Understanding of web development concepts'],
            whatYouWillLearn: [
                'Build full-stack applications',
                'Work with databases (MongoDB)',
                'Implement RESTful APIs',
                'Handle authentication and authorization',
                'Deploy applications to cloud platforms'
            ]
        },
        {
            id: 4,
            title: 'Data Science with Python',
            slug: 'data-science-python',
            instructor: 'Jane Smith',
            instructorId: 2,
            category: 'Data Science',
            level: 'Beginner',
            price: 3499,
            description: 'Learn data analysis, visualization, and machine learning with Python.',
            longDescription: 'Start your data science journey! Learn Python programming, data analysis with pandas, visualization with matplotlib, and introduction to machine learning.',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
            lessons: 18,
            duration: '14 hours',
            students: 1567,
            rating: 4.8,
            reviews: 423,
            lastUpdated: '2024-02-05',
            language: 'English',
            certificate: true,
            syllabus: [
                {
                    section: 'Python Fundamentals',
                    lessons: [
                        { id: 1, title: 'Python for Data Science', duration: '40 min', preview: true, videoUrl: 'https://www.youtube.com/embed/LHBE6Q9XlzI', description: 'Introduction to Python for data science' },
                        { id: 2, title: 'NumPy Essentials', duration: '35 min', preview: true, videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI', description: 'Master NumPy for numerical computing' },
                        { id: 3, title: 'Pandas for Data Analysis', duration: '45 min', preview: false, videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', description: 'Data manipulation with Pandas' },
                    ]
                },
                {
                    section: 'Data Visualization & ML',
                    lessons: [
                        { id: 4, title: 'Matplotlib Basics', duration: '30 min', preview: false, videoUrl: 'https://www.youtube.com/embed/3Xc3CA655Y4', description: 'Create visualizations with Matplotlib' },
                        { id: 5, title: 'Introduction to Machine Learning', duration: '50 min', preview: false, videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU', description: 'ML fundamentals and algorithms' },
                        { id: 6, title: 'Scikit-learn Tutorial', duration: '45 min', preview: false, videoUrl: 'https://www.youtube.com/embed/0B5eIE_1vpU', description: 'Build ML models with Scikit-learn' },
                        { id: 7, title: 'Real-World Data Science Project', duration: '60 min', preview: false, videoUrl: 'https://www.youtube.com/embed/ua-CiDNNj30', description: 'Complete end-to-end data science project' },
                    ]
                }
            ],
            requirements: ['Basic programming knowledge', 'High school mathematics'],
            whatYouWillLearn: [
                'Python programming fundamentals',
                'Data analysis with pandas and NumPy',
                'Data visualization techniques',
                'Introduction to machine learning',
                'Work on real-world datasets'
            ]
        },
        {
            id: 5,
            title: 'UI/UX Design Masterclass',
            slug: 'uiux-design',
            instructor: 'Mike Johnson',
            instructorId: 3,
            category: 'Design',
            level: 'Intermediate',
            price: 2499,
            description: 'Master the art of creating beautiful and user-friendly interfaces.',
            longDescription: 'Learn professional UI/UX design principles, tools, and workflows. Create stunning designs that users love.',
            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop',
            lessons: 12,
            duration: '10 hours',
            students: 945,
            rating: 4.9,
            reviews: 234,
            lastUpdated: '2024-01-28',
            language: 'English',
            certificate: true,
            syllabus: [
                {
                    section: 'Design Fundamentals',
                    lessons: [
                        { id: 1, title: 'Introduction to UI/UX', duration: '35 min', preview: true, videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', description: 'Understanding UI/UX design principles' },
                        { id: 2, title: 'Design Thinking Process', duration: '40 min', preview: true, videoUrl: 'https://www.youtube.com/embed/_r0VX-aU_T8', description: 'Learn the design thinking methodology' },
                        { id: 3, title: 'User Research Methods', duration: '35 min', preview: false, videoUrl: 'https://www.youtube.com/embed/Ovj4hFxko7c', description: 'Conduct effective user research' },
                    ]
                },
                {
                    section: 'Design Tools & Practice',
                    lessons: [
                        { id: 4, title: 'Figma for Beginners', duration: '45 min', preview: false, videoUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8', description: 'Master Figma design tool' },
                        { id: 5, title: 'Creating Wireframes', duration: '30 min', preview: false, videoUrl: 'https://www.youtube.com/embed/qpH7-KFWZRI', description: 'Design effective wireframes' },
                        { id: 6, title: 'Prototyping & Testing', duration: '40 min', preview: false, videoUrl: 'https://www.youtube.com/embed/KWJpKNSg1vQ', description: 'Build and test interactive prototypes' },
                        { id: 7, title: 'Design Systems', duration: '35 min', preview: false, videoUrl: 'https://www.youtube.com/embed/wc5krC28ynQ', description: 'Create scalable design systems' },
                    ]
                }
            ],
            requirements: ['No prior design experience needed', 'Access to Figma (free)'],
            whatYouWillLearn: [
                'UI/UX design principles',
                'User research and personas',
                'Wireframing and prototyping',
                'Design systems and components',
                'Usability testing'
            ]
        },
        {
            id: 6,
            title: 'DevOps Fundamentals',
            slug: 'devops-fundamentals',
            instructor: 'Mike Johnson',
            instructorId: 3,
            category: 'DevOps',
            level: 'Intermediate',
            price: 3999,
            description: 'Learn Docker, Kubernetes, CI/CD, and cloud deployment strategies.',
            longDescription: 'Master modern DevOps practices! Learn containerization, orchestration, continuous integration/deployment, and cloud infrastructure.',
            thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop',
            lessons: 16,
            duration: '13 hours',
            students: 678,
            rating: 4.7,
            reviews: 156,
            lastUpdated: '2024-02-12',
            language: 'English',
            certificate: true,
            syllabus: [
                {
                    section: 'Containerization',
                    lessons: [
                        { id: 1, title: 'Docker Fundamentals', duration: '40 min', preview: true, videoUrl: 'https://www.youtube.com/embed/pg19Z8LL06w', description: 'Introduction to Docker and containers' },
                        { id: 2, title: 'Docker Compose', duration: '35 min', preview: true, videoUrl: 'https://www.youtube.com/embed/HG6yIjZapSA', description: 'Multi-container applications with Docker Compose' },
                        { id: 3, title: 'Kubernetes Basics', duration: '45 min', preview: false, videoUrl: 'https://www.youtube.com/embed/X48VuDVv0do', description: 'Container orchestration with Kubernetes' },
                    ]
                },
                {
                    section: 'CI/CD & Cloud',
                    lessons: [
                        { id: 4, title: 'CI/CD Pipelines', duration: '40 min', preview: false, videoUrl: 'https://www.youtube.com/embed/scEDHsr3APg', description: 'Continuous Integration and Deployment' },
                        { id: 5, title: 'AWS Deployment', duration: '50 min', preview: false, videoUrl: 'https://www.youtube.com/embed/SOTamWNgDKc', description: 'Deploy applications to AWS' },
                        { id: 6, title: 'Infrastructure as Code', duration: '45 min', preview: false, videoUrl: 'https://www.youtube.com/embed/POPP2WTJ8es', description: 'Automate infrastructure with Terraform' },
                    ]
                }
            ],
            requirements: ['Basic Linux knowledge', 'Understanding of web applications'],
            whatYouWillLearn: [
                'Docker containerization',
                'Kubernetes orchestration',
                'CI/CD pipelines',
                'Infrastructure as Code',
                'Cloud deployment (AWS/Azure)'
            ]
        },
    ],

    // Reviews
    reviews: [
        {
            id: 1,
            courseId: 1,
            user: 'Sarah Williams',
            avatar: 'SW',
            rating: 5,
            date: '2024-02-10',
            comment: 'Excellent course! John explains everything clearly and the projects are very practical. Highly recommended for beginners.'
        },
        {
            id: 2,
            courseId: 1,
            user: 'David Chen',
            avatar: 'DC',
            rating: 4,
            date: '2024-02-08',
            comment: 'Great content overall. Would love to see more advanced topics covered in future updates.'
        },
        {
            id: 3,
            courseId: 1,
            user: 'Emily Rodriguez',
            avatar: 'ER',
            rating: 5,
            date: '2024-02-05',
            comment: 'Best React course I\'ve taken! The explanations are clear and the pace is perfect.'
        },
    ],

    // Student Progress (for Test User)
    studentProgress: {
        enrolledCourses: [
            {
                courseId: 1,
                progress: 45,
                completedLessons: 4,
                totalLessons: 10,
                lastAccessed: '2024-02-15',
                timeSpent: '3.5 hours'
            },
            {
                courseId: 2,
                progress: 10,
                completedLessons: 1,
                totalLessons: 15,
                lastAccessed: '2024-02-14',
                timeSpent: '45 minutes'
            },
            {
                courseId: 3,
                progress: 80,
                completedLessons: 16,
                totalLessons: 20,
                lastAccessed: '2024-02-16',
                timeSpent: '12 hours',
                certificateAvailable: true
            },
        ],
    },

    // Achievements
    achievements: [
        {
            id: 1,
            title: 'First Course Completed',
            description: 'Completed HTML & CSS Foundations',
            icon: 'Award',
            date: '2024-01-20',
            badge: 'gold'
        },
        {
            id: 2,
            title: 'Top Performer',
            description: 'Top 10% in Full Stack Cohort',
            icon: 'Trophy',
            date: '2024-02-10',
            badge: 'platinum'
        },
        {
            id: 3,
            title: 'Quiz Master',
            description: 'Scored 100% on 5 quizzes',
            icon: 'Star',
            date: '2024-02-05',
            badge: 'silver'
        },
    ],

    // Notifications
    notifications: [
        {
            id: 1,
            type: 'message',
            title: 'New message from John Doe',
            message: 'We released a new lesson on React Hooks!',
            read: false,
            date: '2024-02-16T10:30:00',
            icon: 'MessageSquare'
        },
        {
            id: 2,
            type: 'promo',
            title: 'Course Price Drop',
            message: 'Advanced Node.js price dropped to ₹999',
            read: true,
            date: '2024-02-15T14:20:00',
            icon: 'Tag'
        },
        {
            id: 3,
            type: 'achievement',
            title: 'New Achievement Unlocked!',
            message: 'You earned the "Quiz Master" badge',
            read: false,
            date: '2024-02-14T09:15:00',
            icon: 'Award'
        },
    ],

    // Recent Activity
    recentActivity: [
        {
            id: 1,
            type: 'quiz',
            title: 'Completed Quiz 2 in Introduction to React',
            description: 'Score: 84%',
            date: '2024-02-16T15:30:00',
            icon: 'CheckCircle'
        },
        {
            id: 2,
            type: 'comment',
            title: 'Commented on Lesson 3',
            description: 'I couldn\'t run the starter — help?',
            date: '2024-02-15T11:20:00',
            icon: 'MessageCircle'
        },
        {
            id: 3,
            type: 'lesson',
            title: 'Completed "State and Lifecycle"',
            description: 'Introduction to React',
            date: '2024-02-15T10:45:00',
            icon: 'PlayCircle'
        },
    ],

    // Upcoming Events
    upcomingEvents: [
        {
            id: 1,
            type: 'live',
            title: 'Live Q&A: React Patterns',
            date: '2024-03-12T19:00:00',
            instructor: 'John Doe',
            course: 'Introduction to React'
        },
        {
            id: 2,
            type: 'assignment',
            title: 'Assignment: Node.js Project',
            dueDate: '2024-03-19',
            course: 'Advanced Node.js'
        },
    ],

    // Leaderboard
    leaderboard: [
        {
            rank: 1,
            name: 'Alex Kumar',
            avatar: 'AK',
            points: 2450,
            coursesCompleted: 8
        },
        {
            rank: 2,
            name: 'Test User',
            avatar: 'TU',
            points: 1890,
            coursesCompleted: 5,
            isCurrentUser: true
        },
        {
            rank: 3,
            name: 'Maria Garcia',
            avatar: 'MG',
            points: 1720,
            coursesCompleted: 6
        },
        {
            rank: 4,
            name: 'James Wilson',
            avatar: 'JW',
            points: 1650,
            coursesCompleted: 5
        },
        {
            rank: 5,
            name: 'Lisa Anderson',
            avatar: 'LA',
            points: 1580,
            coursesCompleted: 4
        },
    ],

    // Testimonials
    testimonials: [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Software Engineer at Google',
            avatar: 'SJ',
            rating: 5,
            comment: 'EduMaster helped me transition into tech. The courses are practical and the instructors are amazing!',
            image: '/testimonials/sarah.jpg'
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Data Scientist at Microsoft',
            avatar: 'MC',
            rating: 5,
            comment: 'The best online learning platform I\'ve used. The quality of content is outstanding.',
            image: '/testimonials/michael.jpg'
        },
        {
            id: 3,
            name: 'Emily Davis',
            role: 'Full Stack Developer',
            avatar: 'ED',
            rating: 5,
            comment: 'I went from zero to landing my dream job in 6 months. Thank you EduMaster!',
            image: '/testimonials/emily.jpg'
        },
    ],
};

export default mockData;
