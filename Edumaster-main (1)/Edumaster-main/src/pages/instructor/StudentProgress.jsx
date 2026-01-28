import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Search, Download, Mail, Filter, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import api from '@/services/api';

const StudentProgress = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [courseFilter, setCourseFilter] = useState('all');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get('/instructor/students');
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
                toast.error('Failed to fetch student progress');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const courses = [...new Set(students.map(s => s.course))];

    // Filter students
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCourse = courseFilter === 'all' || student.course === courseFilter;
        return matchesSearch && matchesCourse;
    });

    const getStatusBadge = (status) => {
        if (status === 'completed') {
            return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
        } else if (status === 'active') {
            return <Badge className="bg-blue-100 text-blue-700">Active</Badge>;
        }
        return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>;
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const handleExport = () => {
        toast.info('Exporting student data...');
        // Implementation for export could be added here
    };

    const handleSendMessage = (studentId) => {
        toast.info(`Sending message to student...`);
    };

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
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Student Progress</h1>
                        <p className="text-muted-foreground">Track student performance across all courses</p>
                    </div>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Total Students</p>
                                <p className="text-3xl font-bold">{students.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Active Students</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {students.filter(s => s.status === 'active').length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {students.filter(s => s.status === 'completed').length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Avg. Progress</p>
                                <p className="text-3xl font-bold">
                                    {students.length > 0
                                        ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
                                        : 0}%
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
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={courseFilter} onValueChange={setCourseFilter}>
                                <SelectTrigger className="w-full md:w-[250px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Filter by course" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Courses</SelectItem>
                                    {courses.map(course => (
                                        <SelectItem key={course} value={course}>{course}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Students Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Students ({filteredStudents.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Lessons</TableHead>
                                    <TableHead>Quiz Score</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Active</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <TableRow key={`${student.id}-${student.course}`}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    <p className="text-sm text-muted-foreground">{student.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm">{student.course}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-32">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium">{student.progress}%</span>
                                                    </div>
                                                    <Progress value={student.progress} />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">
                                                    {student.lessonsCompleted}/{student.totalLessons}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-semibold">{student.quizScore}%</span>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(student.status)}</TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">{formatTimeAgo(student.lastActive)}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleSendMessage(student.id)}
                                                >
                                                    <Mail className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            No students found matching your criteria.
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

export default StudentProgress;
