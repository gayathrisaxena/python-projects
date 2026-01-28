import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Star } from 'lucide-react';

const CourseCard = ({ course, onEnroll }) => {
    const navigate = useNavigate();

    const handleViewCourse = () => {
        navigate(`/student/course/${course.id}`);
    };

    // Handle instructor as both string and object
    const instructorName = typeof course.instructor === 'string'
        ? course.instructor
        : course.instructor?.name || 'Unknown Instructor';

    // Get enrollment count
    const enrollmentCount = course._count?.enrollments || course.students || 0;

    return (
        <Card className="card-hover cursor-pointer" onClick={handleViewCourse}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>{instructorName}</CardDescription>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {course.level}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{enrollmentCount} students</span>
                    </div>
                    {course.rating && (
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                        </div>
                    )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{course.category}</span>
                    <span className="text-lg font-bold text-primary">₹{course.price}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full gradient-primary text-white border-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleViewCourse();
                    }}
                >
                    View Course
                </Button>
            </CardFooter>
        </Card>
    );
};

export default CourseCard;
