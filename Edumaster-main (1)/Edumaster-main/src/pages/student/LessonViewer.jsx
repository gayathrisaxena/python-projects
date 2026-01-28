import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle, PlayCircle, Check, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { toast } from "sonner";

const LessonViewer = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [allLessons, setAllLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completedLessonIds, setCompletedLessonIds] = useState([]);
    const [markingComplete, setMarkingComplete] = useState(false);

    useEffect(() => {
        const fetchCourseContent = async () => {
            try {
                // Fetch course details
                const courseRes = await api.get(`/student/courses/${courseId}`);
                setCourse(courseRes.data);

                // Flatten lessons
                const lessons = [];
                if (courseRes.data.sections) {
                    courseRes.data.sections.forEach(section => {
                        if (section.lessons) {
                            section.lessons.forEach(lesson => {
                                lessons.push({
                                    ...lesson,
                                    sectionName: section.title
                                });
                            });
                        }
                    });
                }
                setAllLessons(lessons);

                // Set current lesson
                const current = lessons.find(l => l.id === lessonId) || lessons[0];
                if (current) {
                    setCurrentLesson(current);
                } else {
                    setError('Lesson not found');
                }

                // Fetch progress
                if (user && user.role === 'STUDENT') {
                    try {
                        const progressRes = await api.get(`/student/progress/${courseId}`);
                        if (progressRes.data && progressRes.data.completedLessons) {
                            setCompletedLessonIds(progressRes.data.completedLessons.map(cl => cl.id));
                        }
                    } catch (err) {
                        console.error('Error fetching progress:', err);
                    }
                }
            } catch (err) {
                console.error('Error loading lesson:', err);
                setError('Failed to load course content');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseContent();
    }, [courseId, lessonId, user]);

    // Update current lesson when URL changes
    useEffect(() => {
        if (allLessons.length > 0 && lessonId) {
            const current = allLessons.find(l => l.id === lessonId);
            if (current) {
                setCurrentLesson(current);
            }
        }
    }, [lessonId, allLessons]);

    const handleNext = () => {
        const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
        if (currentIndex < allLessons.length - 1) {
            const nextLesson = allLessons[currentIndex + 1];
            navigate(`/student/course/${courseId}/lesson/${nextLesson.id}`);
        }
    };

    const handlePrevious = () => {
        const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
        if (currentIndex > 0) {
            const prevLesson = allLessons[currentIndex - 1];
            navigate(`/student/course/${courseId}/lesson/${prevLesson.id}`);
        }
    };

    const handleToggleComplete = async () => {
        if (!user || markingComplete) return;

        setMarkingComplete(true);
        try {
            const isComplete = completedLessonIds.includes(currentLesson.id);

            // Toggle status via API
            await api.post(`/student/progress/${currentLesson.id}`, { completed: !isComplete });

            if (isComplete) {
                // Remove from completed list
                setCompletedLessonIds(prev => prev.filter(id => id !== currentLesson.id));
            } else {
                // Add to completed list
                setCompletedLessonIds(prev => [...prev, currentLesson.id]);
            }
        } catch (err) {
            console.error('Error updating progress:', err);
            toast.error('Failed to update progress');
        } finally {
            setMarkingComplete(false);
        }
    };

    const getEmbedUrl = (url) => {
        if (!url) return null;

        // Handle YouTube URLs
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.includes('v=')
                ? url.split('v=')[1].split('&')[0]
                : url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }

        // Return original URL if it's already an embed or direct link
        return url;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading lesson...</p>
                </div>
            </div>
        );
    }

    if (error || !currentLesson) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
                    <p>{error || 'Lesson not found'}</p>
                    <Button className="mt-4" onClick={() => navigate(`/student/course/${courseId}`)}>
                        Back to Course
                    </Button>
                </div>
            </div>
        );
    }

    const isCurrentLessonComplete = completedLessonIds.includes(currentLesson.id);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-8">
                <div className="mb-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(`/student/course/${courseId}`)}
                        className="pl-0 hover:pl-2 transition-all"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Course Dashboard
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Video Player */}
                    <div className="lg:col-span-2">
                        <Card className="mb-6">
                            <CardContent className="p-0">
                                <div className="aspect-video bg-black rounded-t-lg relative">
                                    {currentLesson.videoUrl ? (
                                        <iframe
                                            className="w-full h-full rounded-t-lg"
                                            src={getEmbedUrl(currentLesson.videoUrl)}
                                            title={currentLesson.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white bg-slate-900 rounded-t-lg">
                                            <div className="text-center">
                                                <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                                <p>Video content not available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="mb-2">
                                        <span className="text-sm text-muted-foreground font-medium bg-muted px-2 py-1 rounded">
                                            {currentLesson.sectionName}
                                        </span>
                                    </div>
                                    <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>

                                    <div className="flex justify-between items-center mb-6 mt-6">
                                        <Button
                                            variant="outline"
                                            onClick={handlePrevious}
                                            disabled={currentIndex === 0}
                                        >
                                            <ChevronLeft className="mr-2 h-4 w-4" />
                                            Previous
                                        </Button>
                                        <span className="text-sm text-muted-foreground hidden sm:inline">
                                            Lesson {currentIndex + 1} of {allLessons.length}
                                        </span>
                                        <Button
                                            onClick={handleNext}
                                            disabled={currentIndex === allLessons.length - 1}
                                        >
                                            Next
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>

                                    <Button
                                        onClick={handleToggleComplete}
                                        disabled={markingComplete}
                                        className={`w-full py-6 ${isCurrentLessonComplete ? 'bg-green-600 hover:bg-green-700' : 'gradient-primary'} text-white border-0`}
                                    >
                                        {isCurrentLessonComplete ? (
                                            <>
                                                <Check className="mr-2 h-5 w-5" />
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 h-5 w-5" />
                                                {markingComplete ? 'Updating...' : 'Mark as Complete'}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>About this Lesson</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-muted-foreground leading-relaxed">
                                    {currentLesson.description || 'No description available for this lesson.'}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                                    <span>Duration: {currentLesson.duration}</span>
                                    <span>•</span>
                                    <span>Course: {course.title}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Lesson List Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
                            <CardHeader>
                                <CardTitle>Course Content</CardTitle>
                                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                    <span>{allLessons.length} lessons</span>
                                    <span>{Math.round((completedLessonIds.length / allLessons.length) * 100)}% complete</span>
                                </div>
                                <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="bg-primary h-full transition-all duration-300"
                                        style={{ width: `${(completedLessonIds.length / allLessons.length) * 100}%` }}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-0">
                                <div className="divide-y">
                                    {allLessons.map((lesson, index) => {
                                        const completed = completedLessonIds.includes(lesson.id);
                                        const isActive = lesson.id === currentLesson.id;

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => navigate(`/student/course/${courseId}/lesson/${lesson.id}`)}
                                                className={`w-full text-left p-4 hover:bg-muted/50 transition-colors flex gap-3 ${isActive ? 'bg-primary/5 border-l-4 border-primary' : 'border-l-4 border-transparent'
                                                    }`}
                                            >
                                                <div className="mt-0.5">
                                                    {completed ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    ) : isActive ? (
                                                        <PlayCircle className="h-5 w-5 text-primary" />
                                                    ) : (
                                                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-medium text-sm mb-0.5 ${isActive ? 'text-primary' : ''}`}>
                                                        {lesson.title}
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                                        {lesson.preview && !completed && (
                                                            <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">Preview</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonViewer;
