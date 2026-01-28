import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from '@/components/layout/Navbar';
import { Link } from 'react-router-dom';
import mockData from '@/data/mockData';
import {
    BookOpen, Clock, Award, TrendingUp, Calendar,
    Bell, MessageSquare, Trophy, Target
} from 'lucide-react';
import api from '@/services/api';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        hoursLearned: 0,
        completedCourses: 0,
        achievements: [],
        recentActivity: []
    });

    // Mock data for other sections
    const { upcomingEvents } = mockData;

    useEffect(() => {
        if (user?.role === 'STUDENT') {
            fetchEnrolledCourses();
            fetchLeaderboard();
            fetchStats();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchEnrolledCourses = async () => {
        try {
            const response = await api.get('/student/my-courses');
            setEnrolledCourses(response.data);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get('/leaderboard');
            // Transform data to match UI requirements
            const formattedLeaderboard = response.data.map((entry, index) => ({
                rank: index + 1,
                name: entry.name,
                avatar: entry.avatar || entry.name.charAt(0).toUpperCase(),
                points: entry.totalScore || 0,
                isCurrentUser: user?.email === entry.email
            }));
            setLeaderboardData(formattedLeaderboard);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/student/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    if (!user || user.role !== 'STUDENT') {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto p-8 text-center">
                    <h1 className="text-2xl font-bold">Access Restricted</h1>
                    <p className="text-muted-foreground">This dashboard is only available for students.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                    <p className="text-muted-foreground">Continue your learning journey</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                                    <p className="text-3xl font-bold">{stats.enrolledCourses || enrolledCourses.length}</p>
                                </div>
                                <BookOpen className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Hours Learned</p>
                                    <p className="text-3xl font-bold">{stats.hoursLearned}</p>
                                </div>
                                <Clock className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Completed Courses</p>
                                    <p className="text-3xl font-bold">{stats.completedCourses}</p>
                                </div>
                                <Trophy className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Leaderboard Rank</p>
                                    <p className="text-3xl font-bold">
                                        {stats.leaderboardRank ? `#${stats.leaderboardRank}` : '-'}
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* My Learning */}
                        <Card>
                            <CardHeader>
                                <CardTitle>My Learning</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-4">Loading courses...</div>
                                ) : enrolledCourses.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                                        <Link to="/courses">
                                            <Button className="gradient-primary text-white border-0">
                                                Browse Courses
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    enrolledCourses.map((enrollment) => (
                                        <div key={enrollment.course.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{enrollment.course.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {typeof enrollment.course.instructor === 'string'
                                                            ? enrollment.course.instructor
                                                            : enrollment.course.instructor?.name || 'Instructor'}
                                                    </p>
                                                </div>
                                                {enrollment.progress === 100 && (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                        Completed
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span>Progress</span>
                                                    <span className="font-semibold">{enrollment.progress}%</span>
                                                </div>
                                                <Progress value={enrollment.progress} className="h-2" />
                                            </div>
                                            <div className="flex gap-2">
                                                <Link to={`/student/course/${enrollment.course.id}`}>
                                                    <Button size="sm" className="gradient-primary text-white border-0">
                                                        Continue Learning
                                                    </Button>
                                                </Link>
                                                {enrollment.progress === 100 && (
                                                    <Button size="sm" variant="outline">
                                                        <Award className="h-4 w-4 mr-2" />
                                                        Get Certificate
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {stats.recentActivity.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-4">No recent activity</p>
                                    ) : (
                                        stats.recentActivity.map((activity) => {
                                            const Icon = activity.icon === 'CheckCircle' ? Award :
                                                activity.icon === 'MessageCircle' ? MessageSquare : BookOpen;
                                            return (
                                                <div key={activity.id} className="flex gap-3 pb-4 border-b last:border-0">
                                                    <div className="mt-1">
                                                        <Icon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{activity.title}</p>
                                                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {new Date(activity.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Weekly Quiz - Only for Students */}
                        {user?.role === 'STUDENT' && (
                            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-primary" />
                                        Weekly Challenge
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Test your knowledge with this week's quiz and earn points!
                                    </p>
                                    <Link to="/student/quiz/weekly">
                                        <Button className="w-full gradient-primary text-white border-0">
                                            Take Quiz
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        {/* Upcoming Events */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Upcoming
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {upcomingEvents.map((event) => (
                                    <div key={event.id} className="p-3 bg-muted/50 rounded-lg">
                                        <p className="font-medium text-sm">{event.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {event.type === 'live'
                                                ? new Date(event.date).toLocaleString()
                                                : `Due: ${event.dueDate}`}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Achievements */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5" />
                                    Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {stats.achievements.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">No achievements yet. Keep learning!</p>
                                ) : (
                                    stats.achievements.map((achievement) => (
                                        <div key={achievement.id} className="flex gap-3 items-start">
                                            <div className={`w-10 h-10 rounded-full gradient-primary flex items-center justify-center`}>
                                                <Award className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{achievement.title}</p>
                                                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                                            </div>
                                        </div>
                                    )))}
                            </CardContent>
                        </Card>

                        {/* Leaderboard - Only for Students */}
                        {user?.role === 'STUDENT' && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Leaderboard
                                    </CardTitle>
                                    <Link to="/student/leaderboard" className="text-xs text-primary hover:underline">
                                        View All
                                    </Link>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {leaderboardData.length > 0 ? (
                                            leaderboardData.slice(0, 5).map((entry) => (
                                                <div
                                                    key={entry.rank}
                                                    className={`flex items-center gap-3 p-2 rounded ${entry.isCurrentUser ? 'bg-primary/10' : ''}`}
                                                >
                                                    <span className="font-bold text-lg w-6">{entry.rank}</span>
                                                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm">
                                                        {entry.avatar}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{entry.name}</p>
                                                        <p className="text-xs text-muted-foreground">{entry.points} points</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                                No scores yet. Be the first!
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
