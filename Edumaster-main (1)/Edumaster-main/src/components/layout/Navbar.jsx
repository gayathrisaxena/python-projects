import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Role-specific navigation items
    const getNavigationItems = () => {
        if (!user) return [];

        switch (user.role) {
            case 'STUDENT':
                return [
                    { label: 'My Courses', path: '/student/my-courses' },
                    { label: 'Weekly Challenge', path: '/student/quiz/weekly' },
                    { label: 'Leaderboard', path: '/student/leaderboard' },
                ];
            case 'INSTRUCTOR':
                return [
                    { label: 'My Courses', path: '/instructor/courses' },
                    { label: 'Create Course', path: '/instructor/courses/create' },
                    { label: 'Students', path: '/instructor/students' },
                    { label: 'Analytics', path: '/instructor/analytics' },
                ];
            case 'ADMIN':
                return [
                    { label: 'Manage Users', path: '/admin/users' },
                    { label: 'Manage Courses', path: '/admin/courses' },
                    { label: 'Analytics', path: '/admin/analytics' },
                ];
            default:
                return [];
        }
    };

    const roleSpecificItems = getNavigationItems();

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex h-16 items-center px-4 container mx-auto">
                <Link to="/" className="text-2xl font-bold text-gradient mr-6">
                    EduMaster
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-6 mr-auto ml-6">
                    <Link to="/courses" className="text-sm hover:text-primary transition-colors">
                        Courses
                    </Link>
                    <Link to="/faq" className="text-sm hover:text-primary transition-colors">
                        FAQ
                    </Link>
                    <Link to="/contact" className="text-sm hover:text-primary transition-colors">
                        Contact
                    </Link>

                    {/* Role-specific navigation items */}
                    {roleSpecificItems.slice(0, 2).map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="text-sm hover:text-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="ml-auto flex items-center space-x-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/avatars/01.png" alt={user.name} />
                                        <AvatarFallback className="gradient-primary text-white">{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                        <p className="text-xs leading-none text-primary mt-1">
                                            {user.role === 'STUDENT' ? '🎓 Student' :
                                                user.role === 'INSTRUCTOR' ? '👨‍🏫 Instructor' :
                                                    '🔧 Admin'}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* Dashboard */}
                                <DropdownMenuItem onClick={() => navigate(`/${user.role.toLowerCase()}`)}>
                                    Dashboard
                                </DropdownMenuItem>

                                {/* Student-specific menu items */}
                                {user.role === 'STUDENT' && (
                                    <>
                                        <DropdownMenuItem onClick={() => navigate('/student/my-courses')}>
                                            My Courses
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/student/certificates')}>
                                            Certificates
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/student/quiz/weekly')}>
                                            Weekly Challenge
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/student/leaderboard')}>
                                            Leaderboard
                                        </DropdownMenuItem>
                                    </>
                                )}

                                {/* Instructor-specific menu items */}
                                {user.role === 'INSTRUCTOR' && (
                                    <>
                                        <DropdownMenuItem onClick={() => navigate('/instructor/courses')}>
                                            My Courses
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/instructor/courses/create')}>
                                            Create Course
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/instructor/students')}>
                                            Student Progress
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/instructor/analytics')}>
                                            Analytics
                                        </DropdownMenuItem>
                                    </>
                                )}

                                {/* Admin-specific menu items */}
                                {user.role === 'ADMIN' && (
                                    <>
                                        <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                                            Manage Users
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/admin/courses')}>
                                            Manage Courses
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/admin/analytics')}>
                                            Analytics
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                                            Settings
                                        </DropdownMenuItem>
                                    </>
                                )}

                                <DropdownMenuSeparator />

                                {/* Profile (available to all) */}
                                <DropdownMenuItem onClick={() => navigate('/profile')}>
                                    Profile
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button className="gradient-primary text-white border-0">Register</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

