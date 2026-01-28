import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/services/api';
import { BookOpen, Clock, Award, TrendingUp, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

const MyCourses = () => {
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const response = await api.get('/student/my-courses');
            setEnrollments(response.data);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            toast.error('Failed to load your courses');
        } finally {
            setLoading(false);
        }
    };

    const inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100);
    const completedCourses = enrollments.filter(e => e.progress === 100);
    const notStartedCourses = enrollments.filter(e => e.progress === 0);

    const CourseCard = ({ enrollment }) => {
        const { course, progress } = enrollment;
        const totalLessons = course.sections?.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0) || 0;

        return (
            <Card className="hover:shadow-lg transition-shadow">
                <div className="relative">
                    <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop'}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {progress === 100 && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            Completed
                        </div>
                    )}
                    {progress > 0 && progress < 100 && (
                        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {progress}% Complete
                        </div>
                    )}
                </div>
                <CardHeader>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{totalLessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration || 'Self-paced'}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            className="flex-1 gradient-primary text-white border-0"
                            onClick={() => navigate(`/student/course/${course.id}`)}
                        >
                            <PlayCircle className="h-4 w-4 mr-2" />
                            {progress === 0 ? 'Start Course' : progress === 100 ? 'Review Course' : 'Continue Learning'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Header */}
            <div className="gradient-primary text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">My Courses</h1>
                    <p className="text-xl text-white/90">Track your learning journey and continue where you left off</p>
                </div>
            </div>

            <div className="container mx-auto p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Courses</p>
                                    <p className="text-3xl font-bold">{enrollments.length}</p>
                                </div>
                                <BookOpen className="h-12 w-12 text-primary opacity-20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">In Progress</p>
                                    <p className="text-3xl font-bold">{inProgressCourses.length}</p>
                                </div>
                                <TrendingUp className="h-12 w-12 text-blue-500 opacity-20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                    <p className="text-3xl font-bold">{completedCourses.length}</p>
                                </div>
                                <Award className="h-12 w-12 text-green-500 opacity-20" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Courses Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="all">All Courses ({enrollments.length})</TabsTrigger>
                        <TabsTrigger value="in-progress">In Progress ({inProgressCourses.length})</TabsTrigger>
                        <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
                        <TabsTrigger value="not-started">Not Started ({notStartedCourses.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        {enrollments.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
                                    <p className="text-muted-foreground mb-6">Start your learning journey by enrolling in a course</p>
                                    <Button onClick={() => navigate('/courses')} className="gradient-primary text-white border-0">
                                        Browse Courses
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {enrollments.map(enrollment => (
                                    <CourseCard key={enrollment.id} enrollment={enrollment} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="in-progress">
                        {inProgressCourses.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No courses in progress</h3>
                                    <p className="text-muted-foreground">Start learning to see your progress here</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {inProgressCourses.map(enrollment => (
                                    <CourseCard key={enrollment.id} enrollment={enrollment} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="completed">
                        {completedCourses.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No completed courses yet</h3>
                                    <p className="text-muted-foreground">Complete a course to earn your certificate</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {completedCourses.map(enrollment => (
                                    <CourseCard key={enrollment.id} enrollment={enrollment} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="not-started">
                        {notStartedCourses.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">All courses started!</h3>
                                    <p className="text-muted-foreground">Great job! You've started all your enrolled courses</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {notStartedCourses.map(enrollment => (
                                    <CourseCard key={enrollment.id} enrollment={enrollment} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default MyCourses;
