import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import api from '@/services/api';
import {
    User, Mail, Phone, MapPin, Calendar, Award,
    BookOpen, Clock, TrendingUp, Edit, Save, X
} from 'lucide-react';
import { toast } from "sonner";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        coursesEnrolled: 0,
        coursesCompleted: 0,
        totalHours: '0',
        achievements: 0,
        rank: '-'
    });
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        avatar: user?.avatar || ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                avatar: user.avatar || ''
            });
            if (user.role === 'STUDENT') {
                fetchStudentStats();
            }
        }
    }, [user]);

    const fetchStudentStats = async () => {
        try {
            const response = await api.get('/student/stats');
            const enrollmentsResponse = await api.get('/student/my-courses');
            const leaderboardResponse = await api.get('/leaderboard');

            const userRank = leaderboardResponse.data.findIndex(entry => entry.email === user.email) + 1;

            setStats({
                coursesEnrolled: enrollmentsResponse.data.length,
                coursesCompleted: response.data.completedCourses,
                totalHours: response.data.hoursLearned,
                achievements: response.data.achievements.length,
                rank: userRank > 0 ? userRank : '-'
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await api.put('/auth/profile', {
                name: formData.name,
                bio: formData.bio,
                avatar: formData.avatar
            });

            // Update user context with new data
            updateUser(response.data);

            setIsEditing(false);
            toast.success('✅ Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('❌ Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
                        <p className="text-muted-foreground">Manage your account information and preferences</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Sidebar - Profile Card */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <Avatar className="h-32 w-32 mb-4">
                                            <AvatarImage src="/avatars/user.png" alt={formData.name} />
                                            <AvatarFallback className="gradient-primary text-white text-3xl">
                                                {formData.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <h2 className="text-2xl font-bold mb-1">{formData.name}</h2>
                                        <p className="text-muted-foreground mb-3">{formData.email}</p>

                                        <Badge className="mb-4 gradient-primary text-white border-0">
                                            {user?.role?.toUpperCase()}
                                        </Badge>

                                        <Button variant="outline" className="w-full mb-3">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Change Photo
                                        </Button>
                                    </div>

                                    <div className="mt-6 pt-6 border-t space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span>{formData.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>Joined January 2024</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Stats Card */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Learning Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            <span className="text-sm">Courses Enrolled</span>
                                        </div>
                                        <span className="font-bold">{stats.coursesEnrolled}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Award className="h-4 w-4 text-primary" />
                                            <span className="text-sm">Completed</span>
                                        </div>
                                        <span className="font-bold">{stats.coursesCompleted}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <span className="text-sm">Hours Learned</span>
                                        </div>
                                        <span className="font-bold">{stats.totalHours}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-primary" />
                                            <span className="text-sm">Leaderboard Rank</span>
                                        </div>
                                        <span className="font-bold">#{stats.rank}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Personal Information</CardTitle>
                                    {!isEditing ? (
                                        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button onClick={handleSave} size="sm" className="gradient-primary text-white border-0">
                                                <Save className="h-4 w-4 mr-2" />
                                                Save
                                            </Button>
                                            <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                                                <X className="h-4 w-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Achievements - Only for Students */}
                            {user?.role === 'STUDENT' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Achievements</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            You have earned {stats.achievements} achievement{stats.achievements !== 1 ? 's' : ''}!
                                        </p>
                                        <p className="text-xs text-center text-muted-foreground">
                                            Complete courses and quizzes to earn more achievements.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Security Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Password</Label>
                                        <div className="flex gap-2 mt-2">
                                            <Input type="password" value="••••••••" disabled />
                                            <Button variant="outline">Change Password</Button>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <Button variant="destructive" className="w-full">
                                            Delete Account
                                        </Button>
                                        <p className="text-xs text-muted-foreground text-center mt-2">
                                            This action cannot be undone
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
