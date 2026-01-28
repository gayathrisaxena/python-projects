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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, Award, BookOpen, Loader2 } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('❌ Failed to load users. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await api.delete(`/admin/users/${userId}`);
                toast.success('✅ User deleted successfully');
                fetchUsers(); // Refresh list
                setIsDrawerOpen(false);
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('❌ Failed to delete user. Please try again.');
            }
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter.toUpperCase();
        return matchesSearch && matchesRole;
    });

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setIsDrawerOpen(true);
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-red-100 text-red-700';
            case 'INSTRUCTOR': return 'bg-blue-100 text-blue-700';
            case 'STUDENT': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success('✅ User role updated successfully');
            fetchUsers(); // Refresh list
            // Update selected user locally to reflect change immediately in drawer
            setSelectedUser(prev => ({ ...prev, role: newRole }));
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('❌ Failed to update user role. Please try again.');
        }
    };

    const isUserActive = (date) => {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return new Date(date) > thirtyDaysAgo;
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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">User Management</h1>
                    <p className="text-muted-foreground">Manage all platform users</p>
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
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="student">Students</SelectItem>
                                    <SelectItem value="instructor">Instructors</SelectItem>
                                    <SelectItem value="admin">Admins</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Activity</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold overflow-hidden">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            user.name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getRoleBadgeColor(user.role)}>
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {isUserActive(user.updatedAt) ? (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {user.role === 'STUDENT' && (
                                                        <span>{user.stats?.coursesEnrolled || 0} courses</span>
                                                    )}
                                                    {user.role === 'INSTRUCTOR' && (
                                                        <span>{user.stats?.coursesCreated || 0} courses</span>
                                                    )}
                                                    {user.role === 'ADMIN' && (
                                                        <span>-</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleViewUser(user)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-destructive"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No users found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* User Detail Drawer */}
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                        {selectedUser && (
                            <>
                                <SheetHeader>
                                    <SheetTitle>User Details</SheetTitle>
                                    <SheetDescription>
                                        Viewing information for {selectedUser.name}
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="mt-6 space-y-6">
                                    {/* Profile Section */}
                                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-semibold overflow-hidden">
                                            {selectedUser.avatar ? (
                                                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                                            ) : (
                                                selectedUser.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                                            <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                            <Badge className={`mt-2 ${getRoleBadgeColor(selectedUser.role)}`}>
                                                {selectedUser.role}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Account Info */}
                                    <div>
                                        <h4 className="font-semibold mb-3">Account Information</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">User ID:</span>
                                                <span className="font-mono text-xs">{selectedUser.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Status:</span>
                                                {isUserActive(selectedUser.updatedAt) ? (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                                                )}
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Joined:</span>
                                                <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Last Active:</span>
                                                <span>{new Date(selectedUser.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                            {selectedUser.bio && (
                                                <div className="pt-2">
                                                    <span className="text-muted-foreground block mb-1">Bio:</span>
                                                    <p className="bg-muted p-2 rounded text-xs">{selectedUser.bio}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Activity Stats */}
                                    {selectedUser.role === 'STUDENT' && (
                                        <div>
                                            <h4 className="font-semibold mb-3">Learning Activity</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4 text-primary" />
                                                        <span className="text-sm">Courses Enrolled</span>
                                                    </div>
                                                    <span className="font-semibold">{selectedUser.stats?.coursesEnrolled || 0}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <Award className="h-4 w-4 text-primary" />
                                                        <span className="text-sm">Courses Completed</span>
                                                    </div>
                                                    <span className="font-semibold">{selectedUser.stats?.coursesCompleted || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.role === 'INSTRUCTOR' && (
                                        <div>
                                            <h4 className="font-semibold mb-3">Teaching Activity</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4 text-primary" />
                                                        <span className="text-sm">Courses Created</span>
                                                    </div>
                                                    <span className="font-semibold">{selectedUser.stats?.coursesCreated || 0}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <Award className="h-4 w-4 text-primary" />
                                                        <span className="text-sm">Total Students</span>
                                                    </div>
                                                    <span className="font-semibold">{selectedUser.stats?.totalStudents?.toLocaleString() || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h4 className="font-semibold">Actions</h4>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Change Role</label>
                                            <Select
                                                value={selectedUser.role}
                                                onValueChange={(value) => handleRoleChange(selectedUser.id, value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="STUDENT">Student</SelectItem>
                                                    <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            variant="destructive"
                                            className="w-full justify-start"
                                            onClick={() => handleDeleteUser(selectedUser.id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete User
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default UserManagement;
