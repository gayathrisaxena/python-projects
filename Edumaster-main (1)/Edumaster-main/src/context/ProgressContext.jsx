import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
};

export const ProgressProvider = ({ children }) => {
    // Load progress from localStorage
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem('courseProgress');
        return saved ? JSON.parse(saved) : {};
    });

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('courseProgress', JSON.stringify(progress));
    }, [progress]);

    // Mark a lesson as complete
    const markLessonComplete = (courseId, lessonId) => {
        setProgress(prev => {
            const courseProgress = prev[courseId] || { completedLessons: [] };
            const completedLessons = courseProgress.completedLessons || [];

            if (!completedLessons.includes(lessonId)) {
                return {
                    ...prev,
                    [courseId]: {
                        ...courseProgress,
                        completedLessons: [...completedLessons, lessonId],
                        lastAccessed: new Date().toISOString()
                    }
                };
            }
            return prev;
        });
    };

    // Mark a lesson as incomplete
    const markLessonIncomplete = (courseId, lessonId) => {
        setProgress(prev => {
            const courseProgress = prev[courseId] || { completedLessons: [] };
            return {
                ...prev,
                [courseId]: {
                    ...courseProgress,
                    completedLessons: courseProgress.completedLessons.filter(id => id !== lessonId),
                    lastAccessed: new Date().toISOString()
                }
            };
        });
    };

    // Check if a lesson is complete
    const isLessonComplete = (courseId, lessonId) => {
        const courseProgress = progress[courseId];
        if (!courseProgress) return false;
        return courseProgress.completedLessons?.includes(lessonId) || false;
    };

    // Get course progress percentage
    const getCourseProgress = (courseId, totalLessons) => {
        const courseProgress = progress[courseId];
        if (!courseProgress || !totalLessons) return 0;
        const completed = courseProgress.completedLessons?.length || 0;
        return Math.round((completed / totalLessons) * 100);
    };

    // Get completed lessons count
    const getCompletedLessonsCount = (courseId) => {
        const courseProgress = progress[courseId];
        return courseProgress?.completedLessons?.length || 0;
    };

    // Get all course progress data
    const getAllProgress = () => progress;

    const value = {
        markLessonComplete,
        markLessonIncomplete,
        isLessonComplete,
        getCourseProgress,
        getCompletedLessonsCount,
        getAllProgress
    };

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
};
