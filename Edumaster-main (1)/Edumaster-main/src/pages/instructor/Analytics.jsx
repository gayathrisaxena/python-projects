import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from '@/services/api';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, BookOpen, Star, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await api.get('/instructor/analytics');
            setAnalyticsData(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto p-8">
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto p-8">
                    <div className="text-center py-12">
                        <p className="text-lg text-muted-foreground">No analytics data available</p>
                    </div>
                </div>
            </div>
        );
    }

    // Transform monthly revenue for charts
    const monthlyChartData = Object.entries(analyticsData.monthlyRevenue || {}).map(([month, revenue]) => ({
        month,
        revenue
    }));

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Instructor Analytics</h1>
                    <p className="text-muted-foreground">Track your courses performance and student engagement</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                                    <p className="text-3xl font-bold">₹{analyticsData.totalRevenue.toLocaleString()}</p>
                                    <p className="text-xs text-green-600 mt-1">Lifetime earnings</p>
                                </div>
                                <DollarSign className="h-10 w-10 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Students</p>
                                    <p className="text-3xl font-bold">{analyticsData.totalStudents.toLocaleString()}</p>
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
                                    <p className="text-sm text-muted-foreground">Average Rating</p>
                                    <p className="text-3xl font-bold">{analyticsData.avgRating}</p>
                                    <p className="text-xs text-green-600 mt-1">Student reviews</p>
                                </div>
                                <Star className="h-10 w-10 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Courses</p>
                                    <p className="text-3xl font-bold">{analyticsData.totalCourses}</p>
                                    <p className="text-xs text-green-600 mt-1">Published</p>
                                </div>
                                <BookOpen className="h-10 w-10 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Revenue Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {monthlyChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={monthlyChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center text-muted-foreground py-12">No revenue data available</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Course Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {analyticsData.coursePerformance.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={analyticsData.coursePerformance} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="title" type="category" width={150} />
                                        <Tooltip />
                                        <Bar dataKey="students" fill="#3B82F6" name="Students" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center text-muted-foreground py-12">No course data available</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Course Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detailed Course Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Course Name</th>
                                        <th className="text-left py-3 px-4">Students</th>
                                        <th className="text-left py-3 px-4">Avg. Progress</th>
                                        <th className="text-left py-3 px-4">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyticsData.coursePerformance.map((course, index) => (
                                        <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                                            <td className="py-3 px-4 font-medium">{course.title}</td>
                                            <td className="py-3 px-4">{course.students}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary"
                                                            style={{ width: `${course.avgProgress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm">{course.avgProgress}%</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">₹{course.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
