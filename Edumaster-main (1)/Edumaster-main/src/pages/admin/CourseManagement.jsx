import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Filter, CheckCircle, XCircle, Star, Users, Loader2, Eye } from 'lucide-react';
import api from '@/services/api';
import { toast } from "sonner";

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveCourse = async (courseId) => {
        try {
            await api.put(`/admin/courses/${courseId}/status`, { published: true });
            toast.success('Course approved successfully');
            fetchCourses();
        } catch (error) {
            console.error('Error approving course:', error);
            toast.error('Failed to approve course');
        }
    };

    const handleRejectCourse = async (courseId) => {
        try {
            await api.put(`/admin/courses/${courseId}/status`, { published: false });
            toast.success('Course unpublished successfully');
            fetchCourses();
        } catch (error) {
            console.error('Error unpublishing course:', error);
            toast.error('Failed to unpublish course');
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            return;
        }
        try {
            await api.delete(`/admin/courses/${courseId}`);
            toast.success('Course deleted successfully');
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Failed to delete course');
        }
    };

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusBadge = (status) => {
        if (status === 'published') {
            return <Badge className="bg-green-100 text-green-700">Published</Badge>;
        } else if (status === 'pending' || status === 'draft') {
            return <Badge className="bg-yellow-100 text-yellow-700">Pending/Draft</Badge>;
        }
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    };

    // Extract unique categories for filter
    const categories = [...new Set(courses.map(c => c.category))].filter(Boolean);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Course Management</h1>
                    <p className="text-muted-foreground">Manage and approve platform courses</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Total Courses</p>
                                <p className="text-3xl font-bold">{courses.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Published</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {courses.filter(c => c.status === 'published').length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Pending/Draft</p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {courses.filter(c => c.status !== 'published').length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Total Students</p>
                                <p className="text-3xl font-bold">
                                    {courses.reduce((sum, c) => sum + (c.students || 0), 0).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search courses or instructors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft/Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Courses Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Courses ({filteredCourses.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Instructor</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Students</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((course) => (
                                        <TableRow key={course.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{course.title}</p>
                                                    <p className="text-sm text-muted-foreground">{new Date(course.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{course.instructor}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{course.category}</Badge>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(course.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span>{(course.students || 0).toLocaleString()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span>{course.rating}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="ghost">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {course.status !== 'published' ? (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-green-600 hover:bg-green-50"
                                                            onClick={() => handleApproveCourse(course.id)}
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-yellow-600 hover:bg-yellow-50"
                                                            onClick={() => handleRejectCourse(course.id)}
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Unpublish
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteCourse(course.id)}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No courses found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CourseManagement;
