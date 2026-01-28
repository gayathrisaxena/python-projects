import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Users, Star, Eye } from 'lucide-react';
import api from '@/services/api';
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/instructor/my-courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const status = course.published ? 'published' : 'draft';
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (published) => {
        if (published) {
            return <Badge className="bg-green-100 text-green-700">Published</Badge>;
        }
        return <Badge className="bg-gray-100 text-gray-700">Draft</Badge>;
    };

    const handleDeleteClick = (course) => {
        setCourseToDelete(course);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!courseToDelete) return;

        try {
            await api.delete(`/instructor/courses/${courseToDelete.id}`);
            setCourses(courses.filter(c => c.id !== courseToDelete.id));
            toast.success('✅ Course deleted successfully');
            setDeleteModalOpen(false);
            setCourseToDelete(null);
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('❌ Failed to delete course. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Calculate stats
    const totalStudents = courses.reduce((sum, c) => sum + (c._count?.enrollments || 0), 0);
    const publishedCount = courses.filter(c => c.published).length;
    const draftCount = courses.filter(c => !c.published).length;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Courses</h1>
                        <p className="text-muted-foreground">Manage all your courses</p>
                    </div>
                    <Link to="/instructor/courses/create">
                        <Button className="gradient-primary text-white border-0">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Course
                        </Button>
                    </Link>
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
                                <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Drafts</p>
                                <p className="text-3xl font-bold text-gray-600">{draftCount}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Total Students</p>
                                <p className="text-3xl font-bold">{totalStudents.toLocaleString()}</p>
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
                                    placeholder="Search courses..."
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
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="card-hover overflow-hidden flex flex-col">
                            <div className="relative">
                                <img
                                    src={course.thumbnail || 'https://via.placeholder.com/400x200'}
                                    alt={course.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(course.published)}
                                </div>
                            </div>
                            <CardContent className="p-6 flex-1 flex flex-col">
                                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                                    {course.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Students:</span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {(course._count?.enrollments || 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Rating:</span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            {course.rating || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Price:</span>
                                        <span className="font-semibold">
                                            {course.price === 0 ? 'Free' : `₹${course.price}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <Link to={`/instructor/courses/${course.id}/edit`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDeleteClick(course)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-muted-foreground mb-4">No courses found</p>
                            <Link to="/instructor/courses/create">
                                <Button className="gradient-primary text-white border-0">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Course
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Course</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MyCourses;
