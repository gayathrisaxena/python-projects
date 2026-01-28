import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import {
    BookOpen, Users, DollarSign, Award, TrendingUp,
    Plus, BarChart3, MessageSquare
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '@/services/api';

const InstructorDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        coursesCreated: 0,
        totalStudents: 0,
        totalEarnings: 0,
        avgRating: 0,
        totalReviews: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/instructor/my-courses');
            const courses = response.data;

            const coursesCreated = courses.length;
            const totalStudents = courses.reduce((sum, c) => sum + (c._count?.enrollments || 0), 0);
            const totalEarnings = courses.reduce((sum, c) => sum + ((c._count?.enrollments || 0) * c.price), 0);

            const ratedCourses = courses.filter(c => c.rating > 0);
            const avgRating = ratedCourses.length > 0
                ? (ratedCourses.reduce((sum, c) => sum + c.rating, 0) / ratedCourses.length).toFixed(1)
                : 0;

            setStats({
                coursesCreated,
                totalStudents,
                totalEarnings,
                avgRating,
                totalReviews: 0 // Need reviews API for this
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mock data for charts (placeholder until backend supports analytics)
    const enrollmentData = [
        { day: 'Mon', enrollments: 45 },
        { day: 'Tue', enrollments: 52 },
        { day: 'Wed', enrollments: 48 },
        { day: 'Thu', enrollments: 61 },
        { day: 'Fri', enrollments: 55 },
        { day: 'Sat', enrollments: 38 },
        { day: 'Sun', enrollments: 42 },
    ];

    const revenueData = [
        { month: 'Jul', revenue: 35000 },
        { month: 'Aug', revenue: 38000 },
        { month: 'Sep', revenue: 42000 },
        { month: 'Oct', revenue: 45000 },
        { month: 'Nov', revenue: 48000 },
        { month: 'Dec', revenue: 52000 },
    ];

    const coursePerformance = [
        { course: 'React Intro', students: 2100, rating: 4.8 },
        { course: 'Node.js', students: 1567, rating: 4.6 },
        { course: 'Full Stack', students: 1234, rating: 4.7 },
        { course: 'Advanced React', students: 945, rating: 4.9 },
        { course: 'GraphQL', students: 856, rating: 4.5 },
    ];

    const recentActivity = [
        { type: 'enrollment', student: 'John Doe', course: 'React Intro', time: '2 hours ago' },
        { type: 'review', student: 'Jane Smith', course: 'Node.js', rating: 5, time: '4 hours ago' },
        { type: 'question', student: 'Mike Johnson', course: 'Full Stack', time: '6 hours ago' },
        { type: 'completion', student: 'Sarah Williams', course: 'React Intro', time: '1 day ago' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Instructor Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
                    </div>
                    <Link to="/instructor/courses/create">
                        <Button className="gradient-primary text-white border-0">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Course
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Courses Created</p>
                                    <p className="text-3xl font-bold">{stats.coursesCreated}</p>
                                    <p className="text-xs text-green-600 mt-1">Total courses</p>
                                </div>
                                <BookOpen className="h-10 w-10 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Students</p>
                                    <p className="text-3xl font-bold">{stats.totalStudents.toLocaleString()}</p>
                                    <p className="text-xs text-green-600 mt-1">Across all courses</p>
                                </div>
                                <Users className="h-10 w-10 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                                    <p className="text-3xl font-bold">₹{(stats.totalEarnings / 1000).toFixed(1)}K</p>
                                    <p className="text-xs text-green-600 mt-1">Estimated revenue</p>
                                </div>
                                <DollarSign className="h-10 w-10 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Avg. Rating</p>
                                    <p className="text-3xl font-bold">{stats.avgRating}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Course average</p>
                                </div>
                                <Award className="h-10 w-10 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Weekly Enrollments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Enrollments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={enrollmentData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="enrollments" fill="#8B5CF6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Revenue Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Course Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={coursePerformance} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="course" type="category" width={120} />
                                    <Tooltip />
                                    <Bar dataKey="students" fill="#3B82F6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'enrollment' ? 'bg-blue-100' :
                                            activity.type === 'review' ? 'bg-yellow-100' :
                                                activity.type === 'question' ? 'bg-purple-100' :
                                                    'bg-green-100'
                                            }`}>
                                            {activity.type === 'enrollment' && <Users className="h-4 w-4 text-blue-600" />}
                                            {activity.type === 'review' && <Award className="h-4 w-4 text-yellow-600" />}
                                            {activity.type === 'question' && <MessageSquare className="h-4 w-4 text-purple-600" />}
                                            {activity.type === 'completion' && <BookOpen className="h-4 w-4 text-green-600" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                {activity.type === 'enrollment' && `${activity.student} enrolled in ${activity.course}`}
                                                {activity.type === 'review' && `${activity.student} left a ${activity.rating}⭐ review on ${activity.course}`}
                                                {activity.type === 'question' && `${activity.student} asked a question in ${activity.course}`}
                                                {activity.type === 'completion' && `${activity.student} completed ${activity.course}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/instructor/courses">
                                <Button variant="outline" className="w-full justify-start h-auto py-4">
                                    <BookOpen className="h-5 w-5 mr-3" />
                                    <div className="text-left">
                                        <p className="font-semibold">Manage Courses</p>
                                        <p className="text-xs text-muted-foreground">View and edit your courses</p>
                                    </div>
                                </Button>
                            </Link>
                            <Link to="/instructor/students">
                                <Button variant="outline" className="w-full justify-start h-auto py-4">
                                    <Users className="h-5 w-5 mr-3" />
                                    <div className="text-left">
                                        <p className="font-semibold">Student Progress</p>
                                        <p className="text-xs text-muted-foreground">Track student performance</p>
                                    </div>
                                </Button>
                            </Link>
                            <Link to="/instructor/analytics">
                                <Button variant="outline" className="w-full justify-start h-auto py-4">
                                    <BarChart3 className="h-5 w-5 mr-3" />
                                    <div className="text-left">
                                        <p className="font-semibold">View Analytics</p>
                                        <p className="text-xs text-muted-foreground">Detailed insights</p>
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default InstructorDashboard;
