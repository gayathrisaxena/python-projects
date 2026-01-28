const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixCourseProgress() {
    try {
        console.log('Starting course progress fix...');

        // Find all completed enrollments
        const completedEnrollments = await prisma.enrollment.findMany({
            where: {
                OR: [
                    { progress: 100 },
                    { completedAt: { not: null } }
                ]
            },
            include: {
                course: {
                    include: {
                        sections: {
                            include: {
                                lessons: true
                            }
                        }
                    }
                }
            }
        });

        console.log(`Found ${completedEnrollments.length} completed enrollments.`);

        for (const enrollment of completedEnrollments) {
            const userId = enrollment.userId;
            const courseId = enrollment.courseId;
            const lessons = enrollment.course.sections.flatMap(section => section.lessons);

            console.log(`Processing user ${userId} for course ${courseId} (${lessons.length} lessons)...`);

            let updatedCount = 0;
            for (const lesson of lessons) {
                await prisma.progress.upsert({
                    where: {
                        userId_lessonId: {
                            userId: userId,
                            lessonId: lesson.id
                        }
                    },
                    update: {
                        completed: true,
                        completedAt: new Date() // Or keep existing if we want to be precise, but this is fine
                    },
                    create: {
                        userId: userId,
                        lessonId: lesson.id,
                        completed: true,
                        completedAt: new Date()
                    }
                });
                updatedCount++;
            }
            console.log(`  - Marked ${updatedCount} lessons as completed.`);
        }

        console.log('Course progress fix completed successfully.');

    } catch (error) {
        console.error('Error fixing course progress:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixCourseProgress();
