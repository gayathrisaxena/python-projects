import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import api from '@/services/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Star, Users } from 'lucide-react';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses');
                setCourses(response.data);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

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

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
                    <p>{error}</p>
                    <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-muted/30 py-12 mb-8">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4 gradient-text">Explore Our Courses</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Discover a wide range of courses designed to help you master new skills and advance your career.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <Card key={course.id} className="flex flex-col h-full hover:shadow-lg transition-shadow overflow-hidden group">
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={course.thumbnail || 'https://via.placeholder.com/300x200?text=Course+Thumbnail'}
                                    alt={course.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="bg-white/90 backdrop-blur text-black font-semibold">
                                        {course.level}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-primary/20">
                                        {course.category}
                                    </Badge>
                                    <div className="flex items-center text-yellow-500 text-xs font-medium">
                                        <Star className="h-3 w-3 fill-current mr-1" />
                                        {course.rating || '4.5'}
                                    </div>
                                </div>
                                <CardTitle className="text-lg font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    {course.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-4 pt-0 flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {course.description}
                                </p>

                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                                    <div className="flex items-center">
                                        <Users className="h-3 w-3 mr-1" />
                                        <span>{course._count?.enrollments || 0} students</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>{course.duration || '10h 30m'}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0 border-t bg-muted/5 mt-auto">
                                <div className="flex items-center justify-between w-full mt-4">
                                    <div className="font-bold text-lg">
                                        {course.price === 0 ? 'Free' : `₹${course.price}`}
                                    </div>
                                    <Link to={`/course/${course.id}`}>
                                        <Button size="sm" className="gradient-primary text-white border-0">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {courses.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No courses found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;
