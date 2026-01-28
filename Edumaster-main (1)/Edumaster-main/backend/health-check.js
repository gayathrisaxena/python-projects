// Database Health Check Script
// Run this to verify all database operations are working correctly

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function healthCheck() {
    console.log('🔍 Starting Database Health Check...\n');

    try {
        // 1. Check database connection
        console.log('1️⃣ Checking database connection...');
        await prisma.$connect();
        console.log('✅ Database connected successfully\n');

        // 2. Check Users table
        console.log('2️⃣ Checking Users table...');
        const userCount = await prisma.user.count();
        const studentCount = await prisma.user.count({ where: { role: 'STUDENT' } });
        const instructorCount = await prisma.user.count({ where: { role: 'INSTRUCTOR' } });
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        console.log(`   Total Users: ${userCount}`);
        console.log(`   Students: ${studentCount}`);
        console.log(`   Instructors: ${instructorCount}`);
        console.log(`   Admins: ${adminCount}`);
        console.log('✅ Users table OK\n');

        // 3. Check Courses table
        console.log('3️⃣ Checking Courses table...');
        const courseCount = await prisma.course.count();
        const publishedCount = await prisma.course.count({ where: { published: true } });
        console.log(`   Total Courses: ${courseCount}`);
        console.log(`   Published: ${publishedCount}`);
        console.log('✅ Courses table OK\n');

        // 4. Check Enrollments
        console.log('4️⃣ Checking Enrollments...');
        const enrollmentCount = await prisma.enrollment.count();
        const paidEnrollments = await prisma.enrollment.count({ where: { paid: true } });
        console.log(`   Total Enrollments: ${enrollmentCount}`);
        console.log(`   Paid Enrollments: ${paidEnrollments}`);
        console.log('✅ Enrollments table OK\n');

        // 5. Check Progress tracking
        console.log('5️⃣ Checking Progress tracking...');
        const progressCount = await prisma.progress.count();
        const completedCount = await prisma.progress.count({ where: { completed: true } });
        console.log(`   Total Progress Records: ${progressCount}`);
        console.log(`   Completed Lessons: ${completedCount}`);
        console.log('✅ Progress table OK\n');

        // 6. Check Quizzes and Attempts
        console.log('6️⃣ Checking Quizzes and Attempts...');
        const quizCount = await prisma.quiz.count();
        const attemptCount = await prisma.attempt.count();
        const weeklyQuiz = await prisma.quiz.count({ where: { type: 'WEEKLY' } });
        console.log(`   Total Quizzes: ${quizCount}`);
        console.log(`   Weekly Quizzes: ${weeklyQuiz}`);
        console.log(`   Total Attempts: ${attemptCount}`);
        console.log('✅ Quizzes and Attempts OK\n');

        // 7. Check Sections and Lessons
        console.log('7️⃣ Checking Sections and Lessons...');
        const sectionCount = await prisma.section.count();
        const lessonCount = await prisma.lesson.count();
        console.log(`   Total Sections: ${sectionCount}`);
        console.log(`   Total Lessons: ${lessonCount}`);
        console.log('✅ Sections and Lessons OK\n');

        // 8. Test a complex query (enrollment with progress)
        console.log('8️⃣ Testing complex query...');
        const sampleEnrollment = await prisma.enrollment.findFirst({
            where: { paid: true },
            include: {
                user: { select: { name: true, role: true } },
                course: { select: { title: true } }
            }
        });
        if (sampleEnrollment) {
            console.log(`   Sample: ${sampleEnrollment.user.name} (${sampleEnrollment.user.role}) enrolled in "${sampleEnrollment.course.title}"`);
            console.log(`   Progress: ${sampleEnrollment.progress}%`);
        }
        console.log('✅ Complex queries working\n');

        // 9. Test leaderboard aggregation
        console.log('9️⃣ Testing leaderboard aggregation...');
        const leaderboard = await prisma.attempt.groupBy({
            by: ['userId'],
            _sum: { score: true },
            _count: { id: true },
            orderBy: { _sum: { score: 'desc' } },
            take: 3
        });
        console.log(`   Top ${leaderboard.length} players found`);
        if (leaderboard.length > 0) {
            console.log(`   Highest score: ${leaderboard[0]._sum.score} points`);
        }
        console.log('✅ Aggregations working\n');

        // 10. Check relationships
        console.log('🔟 Checking relationships...');
        const courseWithRelations = await prisma.course.findFirst({
            include: {
                instructor: true,
                sections: {
                    include: {
                        lessons: true
                    }
                },
                _count: {
                    select: { enrollments: true, reviews: true }
                }
            }
        });
        if (courseWithRelations) {
            console.log(`   Course: "${courseWithRelations.title}"`);
            console.log(`   Instructor: ${courseWithRelations.instructor.name}`);
            console.log(`   Sections: ${courseWithRelations.sections.length}`);
            console.log(`   Enrollments: ${courseWithRelations._count.enrollments}`);
        }
        console.log('✅ Relationships working\n');

        console.log('═══════════════════════════════════════');
        console.log('✅ ALL CHECKS PASSED!');
        console.log('═══════════════════════════════════════');
        console.log('\n📊 Database Summary:');
        console.log(`   Users: ${userCount} (${studentCount} students, ${instructorCount} instructors, ${adminCount} admins)`);
        console.log(`   Courses: ${courseCount} (${publishedCount} published)`);
        console.log(`   Enrollments: ${enrollmentCount} (${paidEnrollments} paid)`);
        console.log(`   Lessons: ${lessonCount} in ${sectionCount} sections`);
        console.log(`   Quizzes: ${quizCount} (${attemptCount} attempts)`);
        console.log(`   Progress: ${completedCount}/${progressCount} lessons completed`);
        console.log('\n✨ Database is healthy and ready for use!\n');

    } catch (error) {
        console.error('\n❌ Health check failed:', error.message);
        console.error('\nPlease check:');
        console.error('1. Database is running');
        console.error('2. DATABASE_URL in .env is correct');
        console.error('3. Migrations have been run: npx prisma migrate dev');
        console.error('4. Database has been seeded: npm run seed\n');
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the health check
healthCheck()
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
