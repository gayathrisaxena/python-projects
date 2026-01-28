const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showAllData() {
    try {
        console.log('='.repeat(80));
        console.log('DATABASE CONTENTS');
        console.log('='.repeat(80));

        // Users
        const users = await prisma.user.findMany({
            orderBy: { role: 'asc' }
        });
        console.log('\n📊 USERS (' + users.length + ' total)');
        console.log('-'.repeat(80));
        users.forEach(user => {
            console.log(`${user.role.padEnd(12)} | ${user.name.padEnd(25)} | ${user.email}`);
        });

        // Courses with instructor info
        const courses = await prisma.course.findMany({
            include: {
                instructor: {
                    select: { name: true, email: true }
                },
                _count: {
                    select: {
                        sections: true,
                        enrollments: true,
                        reviews: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        console.log('\n📚 COURSES (' + courses.length + ' total)');
        console.log('-'.repeat(80));
        courses.forEach(course => {
            console.log(`\nTitle: ${course.title}`);
            console.log(`  Instructor: ${course.instructor.name} (${course.instructor.email})`);
            console.log(`  Price: ₹${course.price} | Level: ${course.level} | Published: ${course.published}`);
            console.log(`  Sections: ${course._count.sections} | Enrollments: ${course._count.enrollments} | Reviews: ${course._count.reviews}`);
        });

        // Sections and Lessons
        const sections = await prisma.section.findMany({
            include: {
                course: { select: { title: true } },
                lessons: true
            },
            orderBy: { order: 'asc' }
        });
        console.log('\n📖 SECTIONS (' + sections.length + ' total)');
        console.log('-'.repeat(80));
        sections.forEach(section => {
            console.log(`\n${section.course.title} → ${section.title}`);
            console.log(`  Lessons: ${section.lessons.length}`);
            section.lessons.forEach(lesson => {
                console.log(`    ${lesson.order}. ${lesson.title} (${lesson.duration || 'N/A'})`);
            });
        });

        // Enrollments
        const enrollments = await prisma.enrollment.findMany({
            include: {
                user: { select: { name: true, email: true } },
                course: { select: { title: true } }
            },
            orderBy: { enrolledAt: 'desc' }
        });
        console.log('\n🎓 ENROLLMENTS (' + enrollments.length + ' total)');
        console.log('-'.repeat(80));
        enrollments.forEach(enroll => {
            console.log(`${enroll.user.name.padEnd(25)} → ${enroll.course.title.substring(0, 40)}`);
            console.log(`  Progress: ${enroll.progress}% | Paid: ${enroll.paid} | Completed: ${enroll.completedAt ? 'Yes' : 'No'}`);
        });

        // Quizzes
        const quizzes = await prisma.quiz.findMany({
            include: {
                course: { select: { title: true } },
                lesson: { select: { title: true } },
                _count: { select: { questions: true, attempts: true } }
            }
        });
        console.log('\n📝 QUIZZES (' + quizzes.length + ' total)');
        console.log('-'.repeat(80));
        quizzes.forEach(quiz => {
            const location = quiz.course ? quiz.course.title : (quiz.lesson ? quiz.lesson.title : 'Weekly');
            console.log(`${quiz.title} (${quiz.type})`);
            console.log(`  Location: ${location}`);
            console.log(`  Questions: ${quiz._count.questions} | Attempts: ${quiz._count.attempts}`);
        });

        // Progress
        const progress = await prisma.progress.findMany({
            include: {
                user: { select: { name: true } },
                lesson: {
                    select: {
                        title: true,
                        section: {
                            select: {
                                course: { select: { title: true } }
                            }
                        }
                    }
                }
            }
        });
        console.log('\n✅ LESSON PROGRESS (' + progress.length + ' total)');
        console.log('-'.repeat(80));
        const completedProgress = progress.filter(p => p.completed);
        console.log(`Completed: ${completedProgress.length} | In Progress: ${progress.length - completedProgress.length}`);

        // Reviews
        const reviews = await prisma.review.findMany({
            include: {
                user: { select: { name: true } },
                course: { select: { title: true } }
            }
        });
        console.log('\n⭐ REVIEWS (' + reviews.length + ' total)');
        console.log('-'.repeat(80));
        reviews.forEach(review => {
            console.log(`${review.user.name} → ${review.course.title}`);
            console.log(`  Rating: ${'⭐'.repeat(review.rating)} (${review.rating}/5)`);
            console.log(`  Comment: ${review.comment || 'No comment'}`);
        });

        // Attempts
        const attempts = await prisma.attempt.findMany({
            include: {
                user: { select: { name: true } },
                quiz: { select: { title: true } }
            },
            orderBy: { submittedAt: 'desc' }
        });
        console.log('\n🎯 QUIZ ATTEMPTS (' + attempts.length + ' total)');
        console.log('-'.repeat(80));
        attempts.forEach(attempt => {
            console.log(`${attempt.user.name} → ${attempt.quiz.title}`);
            console.log(`  Score: ${attempt.score} | Passed: ${attempt.passed ? 'Yes' : 'No'}`);
        });

        console.log('\n' + '='.repeat(80));
        console.log('END OF DATABASE CONTENTS');
        console.log('='.repeat(80));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

showAllData();
