require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./lib/prisma');
const auth = require('./middleware/auth');
const authorize = require('./middleware/authorize');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true
}));
app.use(express.json());

// ==================== AUTHENTICATION ROUTES ====================

// Register new user
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (students are auto-approved)
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'STUDENT',
                avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
            },
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            user,
            token,
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio,
            },
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Get current user
app.get('/api/auth/me', auth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                bio: true,
                createdAt: true,
            },
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile
app.put('/api/auth/profile', auth, async (req, res) => {
    try {
        const { name, bio, avatar } = req.body;

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { name, bio, avatar },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                bio: true,
            },
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== PUBLIC ROUTES ====================

// Health check
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        const userCount = await prisma.user.count();
        const courseCount = await prisma.course.count();
        const lessonCount = await prisma.lesson.count();

        res.json({
            status: 'OK',
            message: 'Server and database are running',
            database: 'Connected to Neon PostgreSQL',
            timestamp: new Date().toISOString(),
            stats: { users: userCount, courses: courseCount, lessons: lessonCount },
        });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', error: error.message });
    }
});

// Get all published courses (public)
// Helper to parse duration string to minutes
const parseDuration = (durationStr) => {
    if (!durationStr) return 0;
    durationStr = durationStr.toLowerCase();
    let minutes = 0;
    const hoursMatch = durationStr.match(/(\d+)\s*h/);
    const minsMatch = durationStr.match(/(\d+)\s*m/);

    if (hoursMatch) {
        minutes += parseInt(hoursMatch[1]) * 60;
    }

    if (minsMatch) {
        minutes += parseInt(minsMatch[1]);
    } else if (!hoursMatch) {
        // Fallback for simple numbers or "min"
        const val = parseInt(durationStr);
        if (!isNaN(val)) minutes += val;
    }

    return minutes;
};

// Get all published courses (public)
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            where: { published: true },
            include: {
                instructor: {
                    select: { id: true, name: true, avatar: true },
                },
                _count: {
                    select: { enrollments: true, reviews: true },
                },
                sections: {
                    include: {
                        lessons: {
                            select: { duration: true }
                        }
                    }
                }
            },
        });

        const coursesWithDuration = courses.map(course => {
            let totalMinutes = 0;
            if (course.sections) {
                course.sections.forEach(section => {
                    if (section.lessons) {
                        section.lessons.forEach(lesson => {
                            totalMinutes += parseDuration(lesson.duration);
                        });
                    }
                });
            }

            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const durationString = hours > 0
                ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
                : `${minutes}m`;

            const { sections, ...courseData } = course;
            return {
                ...courseData,
                duration: totalMinutes > 0 ? durationString : (course.duration || '0m')
            };
        });

        res.json(coursesWithDuration);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single course details (public)
app.get('/api/courses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                instructor: {
                    select: { id: true, name: true, avatar: true, bio: true },
                },
                _count: {
                    select: { enrollments: true, reviews: true },
                },
                sections: {
                    include: {
                        lessons: {
                            select: {
                                id: true,
                                title: true,
                                duration: true,
                                preview: true,
                                order: true,
                                description: true,
                                videoUrl: true
                            },
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { order: 'asc' }
                },
                reviews: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: { name: true, avatar: true }
                        }
                    }
                }
            },
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Calculate duration
        let totalMinutes = 0;
        if (course.sections) {
            course.sections.forEach(section => {
                if (section.lessons) {
                    section.lessons.forEach(lesson => {
                        totalMinutes += parseDuration(lesson.duration);
                    });
                }
            });
        }
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const durationString = hours > 0
            ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
            : `${minutes}m`;

        res.json({
            ...course,
            duration: totalMinutes > 0 ? durationString : (course.duration || '0m')
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== STUDENT ROUTES ====================

// Get single enrolled course with full content
app.get('/api/student/courses/:id', auth, authorize('STUDENT'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user.id,
                    courseId: id,
                },
            },
        });

        if (!enrollment || !enrollment.paid) {
            return res.status(403).json({ error: 'Not enrolled in this course' });
        }

        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                instructor: {
                    select: { id: true, name: true, avatar: true, bio: true },
                },
                sections: {
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                        },
                    },
                    orderBy: { order: 'asc' },
                },
                reviews: {
                    include: {
                        user: {
                            select: { name: true, avatar: true },
                        },
                    },
                },
            },
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get enrolled courses with full content
// Get enrolled courses with full content
app.get('/api/student/my-courses', auth, authorize('STUDENT'), async (req, res) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId: req.user.id,
                paid: true, // Only show paid enrollments
            },
            include: {
                course: {
                    include: {
                        instructor: {
                            select: { id: true, name: true, avatar: true },
                        },
                        sections: {
                            include: {
                                lessons: {
                                    orderBy: { order: 'asc' },
                                },
                            },
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });

        // Calculate duration for each enrolled course
        const enrollmentsWithDuration = enrollments.map(enrollment => {
            const course = enrollment.course;
            let totalMinutes = 0;

            if (course.sections) {
                course.sections.forEach(section => {
                    if (section.lessons) {
                        section.lessons.forEach(lesson => {
                            totalMinutes += parseDuration(lesson.duration);
                        });
                    }
                });
            }

            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const durationString = hours > 0
                ? `${hours}h ${minutes > 0 ? ` ${minutes}m` : ''}`
                : `${minutes}m`;

            return {
                ...enrollment,
                course: {
                    ...course,
                    duration: totalMinutes > 0 ? durationString : (course.duration || 'Self-paced')
                }
            };
        });

        res.json(enrollmentsWithDuration);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get student statistics
// Get student statistics
app.get('/api/student/stats', auth, authorize('STUDENT'), async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Calculate Hours Learned
        const completedProgress = await prisma.progress.findMany({
            where: {
                userId,
                completed: true
            },
            include: {
                lesson: {
                    select: { duration: true }
                }
            }
        });

        let totalMinutes = 0;
        completedProgress.forEach(p => {
            if (p.lesson.duration) {
                totalMinutes += parseDuration(p.lesson.duration);
            }
        });
        const hoursLearned = (totalMinutes / 60).toFixed(1);

        // 2. Calculate Achievements
        const achievements = [];

        // Achievement: First Step (1 lesson completed)
        if (completedProgress.length > 0) {
            achievements.push({
                id: 'first-step',
                title: 'First Step',
                description: 'Completed your first lesson',
                icon: 'CheckCircle'
            });
        }

        // Achievement: Course Champion (1 course completed)
        const completedEnrollments = await prisma.enrollment.count({
            where: { userId, progress: 100 }
        });
        if (completedEnrollments > 0) {
            achievements.push({
                id: 'course-champion',
                title: 'Course Champion',
                description: 'Completed a course',
                icon: 'Award'
            });
        }

        // Achievement: Quiz Whiz (Score > 80 on any quiz)
        const highScoringAttempts = await prisma.attempt.count({
            where: { userId, score: { gte: 80 } }
        });
        if (highScoringAttempts > 0) {
            achievements.push({
                id: 'quiz-whiz',
                title: 'Quiz Whiz',
                description: 'Scored 80+ on a quiz',
                icon: 'Star'
            });
        }

        // Achievement: Dedicated Learner (5+ hours)
        if (parseFloat(hoursLearned) >= 5) {
            achievements.push({
                id: 'dedicated-learner',
                title: 'Dedicated Learner',
                description: 'Learned for over 5 hours',
                icon: 'Clock'
            });
        }

        // 3. Recent Activity
        // Get recent quiz attempts
        const recentAttempts = await prisma.attempt.findMany({
            where: { userId },
            orderBy: { submittedAt: 'desc' },
            take: 5,
            include: { quiz: { select: { title: true } } }
        });

        // Get recent enrollments
        const recentEnrollments = await prisma.enrollment.findMany({
            where: { userId },
            orderBy: { enrolledAt: 'desc' },
            take: 5,
            include: { course: { select: { title: true } } }
        });

        // Get recent completions
        const recentCompletions = await prisma.enrollment.findMany({
            where: {
                userId,
                completedAt: { not: null }
            },
            orderBy: { completedAt: 'desc' },
            take: 3,
            include: { course: { select: { title: true } } }
        });

        // Combine and format
        const activities = [
            ...recentAttempts.map(a => ({
                id: `attempt-${a.id}`,
                type: 'quiz',
                title: `Completed Quiz: ${a.quiz.title}`,
                description: `Scored ${a.score} points`,
                date: a.submittedAt,
                icon: 'CheckCircle'
            })),
            ...recentEnrollments.map(e => ({
                id: `enroll-${e.id}`,
                type: 'enrollment',
                title: `Enrolled in ${e.course.title}`,
                description: 'Started a new learning journey',
                date: e.enrolledAt,
                icon: 'BookOpen'
            })),
            ...recentCompletions.map(c => ({
                id: `complete-${c.id}`,
                type: 'completion',
                title: `Completed ${c.course.title}`,
                description: 'Finished the course! 🎉',
                date: c.completedAt,
                icon: 'Trophy'
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        // 4. Calculate Enrolled Courses
        const enrolledCourses = await prisma.enrollment.count({
            where: { userId }
        });

        // 5. Calculate Leaderboard Rank
        const allScores = await prisma.attempt.groupBy({
            by: ['userId'],
            _sum: { score: true },
        });

        // Sort by score descending
        allScores.sort((a, b) => (b._sum.score || 0) - (a._sum.score || 0));

        // Find user's rank
        const rankIndex = allScores.findIndex(s => s.userId === userId);
        const leaderboardRank = rankIndex === -1 ? '-' : rankIndex + 1;

        res.json({
            hoursLearned,
            completedCourses: completedEnrollments,
            enrolledCourses,
            leaderboardRank,
            achievements,
            recentActivity: activities
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await prisma.attempt.groupBy({
            by: ['userId'],
            _sum: { score: true },
            orderBy: { _sum: { score: 'desc' } },
            take: 10
        });

        const enrichedLeaderboard = await Promise.all(leaderboard.map(async (entry) => {
            const user = await prisma.user.findUnique({
                where: { id: entry.userId },
                select: { name: true, avatar: true }
            });
            return {
                ...user,
                totalScore: entry._sum.score
            };
        }));

        res.json(enrichedLeaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Enroll in course
app.post('/api/student/enroll/:courseId', auth, authorize('STUDENT'), async (req, res) => {
    try {
        const { courseId } = req.params;

        // Check if course exists
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user.id,
                    courseId: courseId,
                },
            },
        });

        if (existingEnrollment) {
            if (existingEnrollment.paid) {
                return res.status(400).json({ error: 'Already enrolled in this course' });
            } else {
                return res.json({
                    message: 'Already enrolled. Please complete payment.',
                    enrollment: existingEnrollment,
                    requiresPayment: true
                });
            }
        }

        const isFree = course.price === 0;

        // Create new enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                userId: req.user.id,
                courseId: courseId,
                paid: isFree,
                paymentAmount: isFree ? 0 : null,
                paymentDate: isFree ? new Date() : null,
            },
            include: {
                course: true,
            },
        });

        res.status(201).json({
            message: isFree ? 'Enrolled successfully' : 'Enrolled. Please complete payment.',
            enrollment,
            requiresPayment: !isFree
        });
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Process payment (Dummy)
app.post('/api/student/pay/:courseId', auth, authorize('STUDENT'), async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user.id,
                    courseId: courseId,
                },
            },
        });

        if (!enrollment) {
            return res.status(404).json({ error: 'Not enrolled in this course' });
        }

        if (enrollment.paid) {
            return res.status(400).json({ error: 'Already paid for this course' });
        }

        // Process dummy payment
        const updatedEnrollment = await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
                paid: true,
                paymentAmount: course.price,
                paymentDate: new Date(),
            },
            include: {
                course: true,
            },
        });

        res.json({
            message: 'Payment successful! You can now access the course content.',
            enrollment: updatedEnrollment,
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mark lesson as complete (or incomplete)
app.post('/api/student/progress/:lessonId', auth, authorize('STUDENT'), async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { completed } = req.body; // Expect boolean, default to true if undefined

        // Check if lesson exists
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                section: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        // Check if user is enrolled and paid
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user.id,
                    courseId: lesson.section.course.id,
                },
            },
        });

        if (!enrollment || !enrollment.paid) {
            return res.status(403).json({ error: 'You must be enrolled and paid to access this lesson' });
        }

        // Determine new status (default to true for backward compatibility)
        const isCompleted = completed !== undefined ? completed : true;

        // Create or update progress
        const progress = await prisma.progress.upsert({
            where: {
                userId_lessonId: {
                    userId: req.user.id,
                    lessonId: lessonId,
                },
            },
            update: {
                completed: isCompleted,
                completedAt: isCompleted ? new Date() : null,
            },
            create: {
                userId: req.user.id,
                lessonId: lessonId,
                completed: isCompleted,
                completedAt: isCompleted ? new Date() : null,
            },
        });

        const completedLessons = await prisma.progress.count({
            where: {
                userId: req.user.id,
                completed: true,
                lesson: {
                    section: {
                        courseId: lesson.section.course.id,
                    },
                },
            },
        });

        // Calculate total lessons in the course
        const totalLessons = await prisma.lesson.count({
            where: { section: { courseId: lesson.section.course.id } }
        });
        const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

        await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { progress: progressPercentage },
        });

        res.json({
            message: 'Progress updated',
            progress,
            courseProgress: progressPercentage,
        });
    } catch (error) {
        console.error('Progress error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get course progress
app.get('/api/student/progress/:courseId', auth, authorize('STUDENT'), async (req, res) => {
    try {
        const { courseId } = req.params;

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user.id,
                    courseId: courseId,
                },
            },
        });

        if (!enrollment) {
            return res.status(404).json({ error: 'Not enrolled in this course' });
        }

        const completedLessons = await prisma.progress.findMany({
            where: {
                userId: req.user.id,
                completed: true,
                lesson: {
                    section: {
                        courseId: courseId,
                    },
                },
            },
            include: {
                lesson: true,
            },
        });

        res.json({
            enrollment,
            completedLessons,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark/Unmark course as completed
app.post('/api/student/complete-course/:courseId', auth, authorize('STUDENT'), async (req, res) => {
    try {
        const { courseId } = req.params;
        const { completed } = req.body; // true to mark complete, false to unmark

        // Check if user is enrolled
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user.id,
                    courseId: courseId,
                },
            },
        });

        if (!enrollment) {
            return res.status(404).json({ error: 'Not enrolled in this course' });
        }

        // Update enrollment with completion status
        const updatedEnrollment = await prisma.enrollment.update({
            where: {
                userId_courseId: {
                    userId: req.user.id,
                    courseId: courseId,
                },
            },
            data: {
                progress: completed ? 100 : enrollment.progress, // Set to 100 if marking complete
                completedAt: completed ? new Date() : null,
            },
        });

        // If marking as completed, also mark all lessons as completed
        if (completed) {
            const courseLessons = await prisma.lesson.findMany({
                where: {
                    section: {
                        courseId: courseId
                    }
                },
                select: { id: true }
            });

            // Create/Update progress for all lessons
            await prisma.$transaction(
                courseLessons.map(lesson =>
                    prisma.progress.upsert({
                        where: {
                            userId_lessonId: {
                                userId: req.user.id,
                                lessonId: lesson.id
                            }
                        },
                        update: {
                            completed: true,
                            completedAt: new Date()
                        },
                        create: {
                            userId: req.user.id,
                            lessonId: lesson.id,
                            completed: true,
                            completedAt: new Date()
                        }
                    })
                )
            );
        }

        res.json({
            message: completed ? 'Course marked as completed!' : 'Course completion unmarked',
            enrollment: updatedEnrollment,
        });
    } catch (error) {
        console.error('Complete course error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get completion history
app.get('/api/student/completion-history', auth, authorize('STUDENT'), async (req, res) => {
    try {
        const completedCourses = await prisma.enrollment.findMany({
            where: {
                userId: req.user.id,
                completedAt: {
                    not: null,
                },
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true,
                        instructor: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                completedAt: 'desc',
            },
        });

        res.json(completedCourses);
    } catch (error) {
        console.error('Completion history error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== QUIZ ROUTES ====================

// Get quizzes for a course (Course quizzes and Lesson quizzes)
app.get('/api/quizzes/course/:courseId', auth, authorize('STUDENT'), async (req, res) => {
    try {
        const { courseId } = req.params;

        const quizzes = await prisma.quiz.findMany({
            where: {
                OR: [
                    { courseId: courseId },
                    { lesson: { section: { courseId: courseId } } }
                ]
            },
            include: {
                lesson: {
                    select: { title: true }
                },
                attempts: {
                    where: { userId: req.user.id },
                    orderBy: { submittedAt: 'desc' },
                    take: 1
                }
            }
        });

        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get weekly quiz (auto-create if missing)
app.get('/api/quizzes/weekly', auth, authorize('STUDENT'), async (req, res) => {
    try {
        // Try to fetch the latest weekly quiz
        let quiz = await prisma.quiz.findFirst({
            where: { type: 'WEEKLY' },
            orderBy: { createdAt: 'desc' },
            include: {
                questions: {
                    select: { id: true, question: true, options: true, points: true, order: true },
                    orderBy: { order: 'asc' }
                },
                attempts: { where: { userId: req.user.id }, orderBy: { submittedAt: 'desc' }, take: 1 }
            }
        });

        // If no weekly quiz exists, create a full-stack quiz with 10 MCQs
        if (!quiz) {
            quiz = await prisma.quiz.create({
                data: {
                    title: 'Weekly Challenge',
                    type: 'WEEKLY',
                    questions: {
                        create: [
                            { question: 'Which protocol is used to fetch resources over the web?', options: ['FTP', 'HTTP', 'SMTP'], correctAnswer: 'HTTP', points: 10, order: 1 },
                            { question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style System', 'Creative Styling Syntax'], correctAnswer: 'Cascading Style Sheets', points: 10, order: 2 },
                            { question: 'In React, which hook is used to manage state?', options: ['useEffect', 'useState', 'useContext'], correctAnswer: 'useState', points: 10, order: 3 },
                            { question: 'Which command initializes a new Node.js project?', options: ['npm init', 'node start', 'npm create'], correctAnswer: 'npm init', points: 10, order: 4 },
                            { question: 'What is the default port for a PostgreSQL database?', options: ['5432', '3306', '1521'], correctAnswer: '5432', points: 10, order: 5 },
                            { question: 'Which of the following is a NoSQL database?', options: ['MySQL', 'MongoDB', 'SQLite'], correctAnswer: 'MongoDB', points: 10, order: 6 },
                            { question: 'What does REST stand for?', options: ['Representational State Transfer', 'Remote Execution Service Tool', 'Real-time Event Streaming'], correctAnswer: 'Representational State Transfer', points: 10, order: 7 },
                            { question: 'Which HTML tag is used to embed JavaScript?', options: ['<script>', '<js>', '<code>'], correctAnswer: '<script>', points: 10, order: 8 },
                            { question: 'In Git, which command creates a new branch?', options: ['git branch <name>', 'git checkout <name>', 'git merge <name>'], correctAnswer: 'git branch <name>', points: 10, order: 9 },
                            { question: 'Which CSS property changes the text color?', options: ['font-color', 'text-color', 'color'], correctAnswer: 'color', points: 10, order: 10 }
                        ]
                    }
                },
                include: {
                    questions: { select: { id: true, question: true, options: true, points: true, order: true }, orderBy: { order: 'asc' } },
                    attempts: { where: { userId: req.user.id }, orderBy: { submittedAt: 'desc' }, take: 1 }
                }
            });
        }

        res.json(quiz);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single quiz by ID
app.get('/api/quizzes/:id', auth, authorize('STUDENT'), async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: {
                    select: {
                        id: true,
                        question: true,
                        options: true,
                        points: true,
                        order: true
                    },
                    orderBy: { order: 'asc' }
                },
                course: {
                    select: { id: true, title: true }
                },
                lesson: {
                    select: { id: true, title: true }
                },
                attempts: {
                    where: { userId: req.user.id },
                    orderBy: { submittedAt: 'desc' },
                    take: 1
                }
            }
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.json(quiz);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit quiz attempt
app.post('/api/quizzes/:id/submit', auth, authorize('STUDENT'), async (req, res) => {
    try {
        const { id } = req.params;
        const { answers } = req.body; // { questionId: answer }

        const quiz = await prisma.quiz.findUnique({
            where: { id },
            include: { questions: true }
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        let score = 0;
        let totalPoints = 0;

        quiz.questions.forEach(q => {
            totalPoints += q.points;
            if (answers[q.id] === q.correctAnswer) {
                score += q.points;
            }
        });

        const attempt = await prisma.attempt.create({
            data: {
                userId: req.user.id,
                quizId: id,
                score,
                answers
            }
        });

        res.json({
            score,
            totalPoints,
            passed: score >= quiz.passingScore,
            attempt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        // Aggregate total score per user
        const leaderboard = await prisma.attempt.groupBy({
            by: ['userId'],
            _sum: {
                score: true
            },
            orderBy: {
                _sum: {
                    score: 'desc'
                }
            }
        });

        // Fetch user details including email for proper identification
        const enrichedLeaderboard = await Promise.all(leaderboard.map(async (entry) => {
            const user = await prisma.user.findUnique({
                where: { id: entry.userId },
                select: { name: true, avatar: true, email: true }
            });
            return {
                ...user,
                totalScore: entry._sum.score
            };
        }));

        res.json(enrichedLeaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get admin analytics
app.get('/api/admin/analytics', auth, authorize('ADMIN'), async (req, res) => {
    try {
        // Total counts
        const totalUsers = await prisma.user.count();
        const totalCourses = await prisma.course.count();
        const totalEnrollments = await prisma.enrollment.count({ where: { paid: true } });
        const totalRevenue = await prisma.enrollment.aggregate({
            where: { paid: true },
            _sum: { paymentAmount: true }
        });

        // User breakdown by role
        const usersByRole = await prisma.user.groupBy({
            by: ['role'],
            _count: true
        });

        // Monthly enrollments (last 8 months)
        const eightMonthsAgo = new Date();
        eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

        const enrollmentsByMonth = await prisma.enrollment.findMany({
            where: {
                enrolledAt: { gte: eightMonthsAgo },
                paid: true
            },
            select: {
                enrolledAt: true,
                paymentAmount: true
            }
        });

        // Process monthly data
        const monthlyData = {};
        enrollmentsByMonth.forEach(enrollment => {
            const month = new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short' });
            if (!monthlyData[month]) {
                monthlyData[month] = { enrollments: 0, revenue: 0 };
            }
            monthlyData[month].enrollments++;
            monthlyData[month].revenue += enrollment.paymentAmount || 0;
        });

        // Course completion rates
        const courses = await prisma.course.findMany({
            select: {
                id: true,
                title: true,
                enrollments: {
                    select: {
                        progress: true
                    }
                }
            }
        });

        const courseCompletionData = courses.map(course => {
            const totalEnrolled = course.enrollments.length;
            const completed = course.enrollments.filter(e => e.progress === 100).length;
            return {
                course: course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title,
                completion: totalEnrolled > 0 ? Math.round((completed / totalEnrolled) * 100) : 0
            };
        }).slice(0, 6);

        // Average completion rate
        const allEnrollments = await prisma.enrollment.findMany({
            where: { paid: true },
            select: { progress: true }
        });
        const avgCompletion = allEnrollments.length > 0
            ? Math.round(allEnrollments.reduce((sum, e) => sum + e.progress, 0) / allEnrollments.length)
            : 0;

        res.json({
            totalUsers,
            totalCourses,
            totalEnrollments,
            totalRevenue: totalRevenue._sum.paymentAmount || 0,
            usersByRole,
            monthlyData,
            courseCompletionData,
            avgCompletion,
            dailyActiveUsers: totalUsers // Simplified - could track login times
        });
    } catch (error) {
        console.error('Admin analytics error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get instructor analytics
app.get('/api/instructor/analytics', auth, authorize('INSTRUCTOR'), async (req, res) => {
    try {
        const instructorId = req.user.id;

        // Get instructor's courses
        const courses = await prisma.course.findMany({
            where: { instructorId },
            include: {
                enrollments: {
                    where: { paid: true },
                    select: {
                        paymentAmount: true,
                        progress: true,
                        enrolledAt: true
                    }
                },
                _count: {
                    select: { enrollments: true, reviews: true }
                }
            }
        });

        const totalCourses = courses.length;
        const totalStudents = courses.reduce((sum, course) => sum + course.enrollments.length, 0);
        const totalRevenue = courses.reduce((sum, course) =>
            sum + course.enrollments.reduce((s, e) => s + (e.paymentAmount || 0), 0), 0
        );

        // Calculate average rating
        const allReviews = await prisma.review.findMany({
            where: {
                course: { instructorId }
            },
            select: { rating: true }
        });
        const avgRating = allReviews.length > 0
            ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
            : 0;

        // Monthly revenue
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = {};
        courses.forEach(course => {
            course.enrollments.forEach(enrollment => {
                if (enrollment.enrolledAt >= sixMonthsAgo) {
                    const month = new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short' });
                    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (enrollment.paymentAmount || 0);
                }
            });
        });

        // Course performance
        const coursePerformance = courses.map(course => ({
            title: course.title,
            students: course.enrollments.length,
            avgProgress: course.enrollments.length > 0
                ? Math.round(course.enrollments.reduce((sum, e) => sum + e.progress, 0) / course.enrollments.length)
                : 0,
            revenue: course.enrollments.reduce((sum, e) => sum + (e.paymentAmount || 0), 0)
        }));

        res.json({
            totalCourses,
            totalStudents,
            totalRevenue,
            avgRating,
            monthlyRevenue,
            coursePerformance
        });
    } catch (error) {
        console.error('Instructor analytics error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== INSTRUCTOR ROUTES ====================

// Create new course
app.post('/api/instructor/courses', auth, authorize('INSTRUCTOR'), async (req, res) => {
    try {
        const { title, description, longDescription, thumbnail, price, level, category, language } = req.body;

        // Validation
        if (!title || !description || !price) {
            return res.status(400).json({ error: 'Please provide title, description, and price' });
        }

        // Generate slug
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const course = await prisma.course.create({
            data: {
                title,
                slug,
                description,
                longDescription,
                thumbnail,
                price: parseInt(price),
                level: level || 'BEGINNER',
                category: category || 'General',
                language: language || 'English',
                published: true, // Auto-publish for instructors
                instructorId: req.user.id,
            },
        });

        res.status(201).json({
            message: 'Course created successfully',
            course,
        });
    } catch (error) {
        console.error('Course creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update course
app.put('/api/instructor/courses/:id', auth, authorize('INSTRUCTOR'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if course belongs to instructor
        const existingCourse = await prisma.course.findUnique({
            where: { id },
        });

        if (!existingCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        if (existingCourse.instructorId !== req.user.id) {
            return res.status(403).json({ error: 'You can only update your own courses' });
        }

        const course = await prisma.course.update({
            where: { id },
            data: req.body,
        });

        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add section to course
app.post('/api/instructor/courses/:courseId/sections', auth, authorize('INSTRUCTOR'), async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, order } = req.body;

        // Check if course belongs to instructor
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        if (course.instructorId !== req.user.id) {
            return res.status(403).json({ error: 'You can only add sections to your own courses' });
        }

        const section = await prisma.section.create({
            data: {
                courseId,
                title,
                order: order || 1,
            },
        });

        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add lesson to section
app.post('/api/instructor/sections/:sectionId/lessons', auth, authorize('INSTRUCTOR'), async (req, res) => {
    try {
        const { sectionId } = req.params;
        const { title, description, videoUrl, duration, order, preview } = req.body;

        // Check if section belongs to instructor's course
        const section = await prisma.section.findUnique({
            where: { id: sectionId },
            include: { course: true },
        });

        if (!section) {
            return res.status(404).json({ error: 'Section not found' });
        }

        if (section.course.instructorId !== req.user.id) {
            return res.status(403).json({ error: 'You can only add lessons to your own courses' });
        }

        const lesson = await prisma.lesson.create({
            data: {
                sectionId,
                title,
                description,
                videoUrl,
                duration,
                order: order || 1,
                preview: preview || false,
            },
        });

        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get instructor's courses
app.get('/api/instructor/my-courses', auth, authorize('INSTRUCTOR'), async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            where: { instructorId: req.user.id },
            include: {
                sections: {
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                        },
                    },
                    orderBy: { order: 'asc' },
                },
                _count: {
                    select: { enrollments: true, reviews: true },
                },
            },
        });

        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get instructor's students with progress
app.get('/api/instructor/students', auth, authorize('INSTRUCTOR'), async (req, res) => {
    try {
        const instructorId = req.user.id;

        // Get all courses by this instructor
        const courses = await prisma.course.findMany({
            where: { instructorId },
            select: { id: true, title: true }
        });

        const courseIds = courses.map(c => c.id);

        if (courseIds.length === 0) {
            return res.json([]);
        }

        // Get all enrollments for these courses
        const enrollments = await prisma.enrollment.findMany({
            where: {
                courseId: { in: courseIds },
                paid: true
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                        sections: {
                            select: {
                                lessons: {
                                    select: { id: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Process data
        const studentsData = await Promise.all(enrollments.map(async (enrollment) => {
            // Calculate lessons completed
            const totalLessons = enrollment.course.sections.reduce((acc, section) => acc + section.lessons.length, 0);

            // Count completed lessons
            const completedLessonsCount = await prisma.progress.count({
                where: {
                    userId: enrollment.userId,
                    completed: true,
                    lesson: {
                        section: {
                            courseId: enrollment.course.id
                        }
                    }
                }
            });

            // Get average quiz score for this course
            const quizAttempts = await prisma.attempt.findMany({
                where: {
                    userId: enrollment.userId,
                    quiz: {
                        OR: [
                            { courseId: enrollment.course.id },
                            { lesson: { section: { courseId: enrollment.course.id } } }
                        ]
                    }
                },
                select: { score: true }
            });

            const avgQuizScore = quizAttempts.length > 0
                ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
                : 0;

            // Determine status
            let status = 'active';
            if (enrollment.progress === 100) status = 'completed';

            // Last active
            const lastProgress = await prisma.progress.findFirst({
                where: {
                    userId: enrollment.userId,
                    lesson: { section: { courseId: enrollment.course.id } }
                },
                orderBy: { completedAt: 'desc' }
            });

            const lastActiveDate = lastProgress?.completedAt || enrollment.enrolledAt;

            return {
                id: enrollment.user.id,
                name: enrollment.user.name,
                email: enrollment.user.email,
                course: enrollment.course.title,
                enrolled: enrollment.enrolledAt,
                progress: enrollment.progress,
                lessonsCompleted: completedLessonsCount,
                totalLessons: totalLessons,
                quizScore: avgQuizScore,
                lastActive: lastActiveDate,
                status: status
            };
        }));

        res.json(studentsData);

    } catch (error) {
        console.error('Fetch students error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== ADMIN ROUTES ====================

// Get all courses (Admin)
app.get('/api/admin/courses', auth, authorize('ADMIN'), async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                instructor: {
                    select: { name: true }
                },
                _count: {
                    select: { enrollments: true, reviews: true }
                },
                reviews: {
                    select: { rating: true }
                }
            }
        });

        const coursesWithStats = courses.map(course => {
            const avgRating = course.reviews.length > 0
                ? (course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length).toFixed(1)
                : 0;

            return {
                id: course.id,
                title: course.title,
                instructor: course.instructor.name,
                category: course.category,
                status: course.published ? 'published' : 'draft',
                students: course._count.enrollments,
                lessons: 0,
                rating: avgRating,
                createdAt: course.createdAt
            };
        });

        res.json(coursesWithStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users with detailed stats
app.get('/api/admin/users', auth, authorize('ADMIN'), async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                bio: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        enrollments: true,
                        coursesCreated: true
                    }
                },
                // For students: count completed courses
                enrollments: {
                    where: { completedAt: { not: null } },
                    select: { id: true }
                },
                // For instructors: count total students across their courses
                coursesCreated: {
                    select: {
                        _count: {
                            select: { enrollments: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transform data to be more frontend-friendly
        const transformedUsers = users.map(user => {
            const userData = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                stats: {
                    coursesEnrolled: user._count.enrollments,
                    coursesCreated: user._count.coursesCreated,
                    coursesCompleted: user.enrollments.length,
                    totalStudents: user.coursesCreated.reduce((sum, course) => sum + course._count.enrollments, 0)
                }
            };
            return userData;
        });

        res.json(transformedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Change user role
app.put('/api/admin/users/:id/role', auth, authorize('ADMIN'), async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['ADMIN', 'INSTRUCTOR', 'STUDENT'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user
app.delete('/api/admin/users/:id', auth, authorize('ADMIN'), async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: req.params.id },
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update course status (Admin)
app.put('/api/admin/courses/:id/status', auth, authorize('ADMIN'), async (req, res) => {
    try {
        const { id } = req.params;
        const { published } = req.body;

        const course = await prisma.course.update({
            where: { id },
            data: { published },
        });

        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete course (Admin)
app.delete('/api/admin/courses/:id', auth, authorize('ADMIN'), async (req, res) => {
    try {
        await prisma.course.delete({
            where: { id: req.params.id },
        });

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth endpoints ready`);
    console.log(`💳 Payment system enabled`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
