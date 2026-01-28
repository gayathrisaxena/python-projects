import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import CourseCard from '@/components/features/CourseCard';
import mockData from '@/data/mockData';
import api from '@/services/api';
import { GraduationCap, BookOpen, Award, Search, Filter, Trophy } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [sortBy, setSortBy] = useState('popular');
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loadingEnrollments, setLoadingEnrollments] = useState(false);
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    // Fetch all courses
    useEffect(() => {
        const fetchCourses = async () => {
            setLoadingCourses(true);
            try {
                const response = await api.get('/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                // Fallback to mock data if API fails
                setCourses(mockData.courses);
            }
            setLoadingCourses(false);
        };

        fetchCourses();
    }, []);

    // Fetch enrolled courses for logged-in students
    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            if (user && user.role === 'STUDENT') {
                setLoadingEnrollments(true);
                try {
                    const response = await api.get('/student/my-courses');
                    setEnrolledCourses(response.data);
                } catch (error) {
                    console.error('Error fetching enrolled courses:', error);
                }
                setLoadingEnrollments(false);
            }
        };

        fetchEnrolledCourses();
    }, [user]);

    const handleEnroll = (courseId) => {
        if (!user) {
            navigate('/login');
        } else {
            toast.success(`Enrolled in course ${courseId}`);
        }
    };

    // Filter and sort courses
    let filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
        const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel.toLowerCase();
        return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort courses
    filteredCourses = filteredCourses.sort((a, b) => {
        switch (sortBy) {
            case 'popular':
                return (b._count?.enrollments || 0) - (a._count?.enrollments || 0);
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden gradient-primary py-24">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-6xl font-bold mb-6 text-white drop-shadow-lg">
                        Welcome to EduMaster
                    </h1>
                    <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                        Your Ultimate Learning Management System. Learn, Teach, and Grow with our comprehensive platform.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search for courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-12 bg-white/90 backdrop-blur-sm"
                                />
                            </div>
                            <Button size="lg" variant="secondary" className="h-12 px-6">
                                Search
                            </Button>
                        </div>
                    </div>

                    {!user && (
                        <div className="flex gap-4 justify-center">
                            <Link to="/login">
                                <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-shadow">
                                    Get Started
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Weekly Challenge Section - Only for Students and non-logged-in users */}
            {(!user || user.role === 'STUDENT') && (
                <section className="py-12 bg-primary/5 border-y border-primary/10">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-background p-8 rounded-2xl shadow-sm border border-primary/20">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Trophy className="h-10 w-10 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Weekly Challenge</h2>
                                    <p className="text-muted-foreground text-lg">
                                        Test your knowledge with this week's quiz and earn points!
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                className="gradient-primary text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all min-w-[200px]"
                                onClick={() => navigate(user ? '/student/quiz/weekly' : '/login')}
                            >
                                Take Quiz
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Continue Learning Section - Only for students with enrolled courses */}
            {user && user.role === 'STUDENT' && enrolledCourses.length > 0 && (
                <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold">Continue Learning</h2>
                            <Link to="/student">
                                <Button variant="outline">View Dashboard</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses.map((enrollment) => {
                                const course = enrollment.course;
                                if (!course) return null;

                                // Calculate total lessons from syllabus
                                const totalLessons = course.sections?.reduce(
                                    (acc, section) => acc + (section.lessons?.length || 0),
                                    0
                                ) || 0;

                                return (
                                    <Card key={enrollment.id} className="card-hover">
                                        <CardHeader>
                                            <div className="flex justify-between items-start mb-2">
                                                <CardTitle className="text-lg">{course.title}</CardTitle>
                                                {enrollment.progress === 100 && (
                                                    <Award className="h-5 w-5 text-green-600" />
                                                )}
                                            </div>
                                            <CardDescription>{course.instructor?.name}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="mb-4">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-muted-foreground">
                                                        {totalLessons} lessons
                                                    </span>
                                                    <span className="font-semibold text-primary">
                                                        {enrollment.progress}%
                                                    </span>
                                                </div>
                                                <Progress value={enrollment.progress} className="h-2" />
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-4">
                                                Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                            </p>
                                            <Link to={`/student/course/${course.id}`}>
                                                <Button className="w-full gradient-primary text-white border-0">
                                                    Continue Learning
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Categories Section */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6 text-center">Browse by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {mockData.categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.name)}
                                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${selectedCategory === category.name
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border bg-background'
                                    }`}
                            >
                                <div className="text-center">
                                    <p className="font-semibold">{category.name}</p>
                                    <p className="text-sm text-muted-foreground">{category.count} courses</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gradient-to-b from-background to-muted/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose EduMaster?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
                                <GraduationCap className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
                            <p className="text-muted-foreground">Learn from industry professionals with years of experience.</p>
                        </div>
                        <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Comprehensive Courses</h3>
                            <p className="text-muted-foreground">Access a wide range of courses across multiple disciplines.</p>
                        </div>
                        <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
                                <Award className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Earn Certificates</h3>
                            <p className="text-muted-foreground">Get certified upon course completion to boost your career.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">
                            {searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all'
                                ? 'Search Results'
                                : 'Popular Courses'}
                        </h2>

                        {/* Filters */}
                        <div className="flex gap-3">
                            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popular">Most Popular</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map(course => (
                                <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">No courses found matching your criteria.</p>
                            <Button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setSelectedLevel('all');
                                }}
                                className="mt-4"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {mockData.testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-background p-6 rounded-lg shadow-md">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Award key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground">{testimonial.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
