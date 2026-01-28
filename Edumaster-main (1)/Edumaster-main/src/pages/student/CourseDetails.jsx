import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { BookOpen, Clock, Award, Users, Star, ChevronDown, ChevronUp, PlayCircle, CheckCircle, Lock, Trophy, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolled, setEnrolled] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [progress, setProgress] = useState(0);
    const [expandedSections, setExpandedSections] = useState([0]);
    const [enrolling, setEnrolling] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [completedAt, setCompletedAt] = useState(null);
    const [togglingCompletion, setTogglingCompletion] = useState(false);
    const [completedLessonIds, setCompletedLessonIds] = useState([]);
    const [togglingLessonId, setTogglingLessonId] = useState(null);

    // Helper values
    const totalLessons = course?.sections?.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0) || 0;
    const instructorName = typeof course?.instructor === 'string' ? course.instructor : course?.instructor?.name || 'Unknown Instructor';
    const instructorAvatar = typeof course?.instructor === 'object' && course.instructor?.avatar ? course.instructor.avatar : instructorName?.charAt(0);

    // Fetch course details and enrollment status
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const courseRes = await api.get(`/courses/${id}`);
                setCourse(courseRes.data);
                if (user && user.role === 'STUDENT') {
                    try {
                        const progressRes = await api.get(`/student/progress/${id}`);
                        if (progressRes.data) {
                            setEnrolled(true);
                            setIsPaid(progressRes.data.enrollment.paid);
                            setProgress(progressRes.data.enrollment.progress || 0);
                            const completedIds = progressRes.data.completedLessons?.map(l => l.id) || [];
                            setCompletedLessonIds(completedIds);
                            setIsCompleted(progressRes.data.enrollment.progress === 100);
                            setCompletedAt(progressRes.data.enrollment.completedAt);
                        }
                    } catch (err) {
                        setEnrolled(false);
                    }
                }
            } catch (err) {
                console.error('Error fetching course:', err);
                setError('Failed to load course details');
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails();
        if (user && user.role === 'STUDENT') fetchQuizzes();
    }, [id, user]);

    // Fetch quizzes when enrollment changes
    useEffect(() => {
        if (enrolled) fetchQuizzes();
    }, [enrolled]);

    const fetchQuizzes = async () => {
        try {
            const res = await api.get(`/quizzes/course/${id}`);
            setQuizzes(res.data);
        } catch (err) {
            console.error('Error fetching quizzes:', err);
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'STUDENT') {
            toast.error('❌ Only students can enroll in courses. Please switch to a student account.');
            return;
        }
        setEnrolling(true);
        try {
            const res = await api.post(`/student/enroll/${id}`);
            if (res.data.requiresPayment) {
                setEnrolled(true);
                setIsPaid(false);
                toast.success('✅ Enrolled successfully! Please complete payment to access course content.');
                setPaymentModalOpen(true);
            } else {
                setEnrolled(true);
                setIsPaid(true);
                toast.success('🎉 Successfully enrolled in the course!');
            }
        } catch (err) {
            console.error('Enrollment error:', err);
            toast.error('❌ ' + (err.response?.data?.error || 'Failed to enroll. Please try again.'));
        } finally {
            setEnrolling(false);
        }
    };

    const handlePaymentClick = () => setPaymentModalOpen(true);

    const processPayment = async (e) => {
        e.preventDefault();
        setProcessingPayment(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await api.post(`/student/pay/${id}`);
            setIsPaid(true);
            setPaymentModalOpen(false);
            toast.success('💳 Payment successful! You can now access the full course content.');
        } catch (err) {
            console.error('Payment error:', err);
            toast.error('❌ Payment failed. Please try again or contact support.');
        } finally {
            setProcessingPayment(false);
        }
    };

    const toggleCourseCompletion = async () => {
        setTogglingCompletion(true);
        try {
            const response = await api.post(`/student/complete-course/${id}`, { completed: !isCompleted });
            setIsCompleted(!isCompleted);
            setCompletedAt(response.data.enrollment.completedAt);
            setProgress(response.data.enrollment.progress);
            if (!isCompleted) toast.success('🎉 Course marked as completed!');
            else toast.info('ℹ️ Course marked as incomplete');
        } catch (error) {
            console.error('Error toggling completion:', error);
            toast.error('❌ Failed to update completion status. Please try again.');
        } finally {
            setTogglingCompletion(false);
        }
    };

    const toggleSection = (index) => {
        setExpandedSections(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    // Persist per‑lesson completion toggle
    const toggleLessonCompletion = async (lessonId) => {
        if (!user) {
            toast.error('❌ Please log in to mark lessons as complete.');
            return;
        }

        // Prevent multiple simultaneous toggles
        if (togglingLessonId) {
            return;
        }

        setTogglingLessonId(lessonId);

        const currentlyCompleted = completedLessonIds.includes(lessonId);
        const previousCompletedIds = [...completedLessonIds];
        const previousProgress = progress;

        // Optimistically update UI
        const newCompletedIds = currentlyCompleted
            ? completedLessonIds.filter((id) => id !== lessonId)
            : [...completedLessonIds, lessonId];

        const newProgress = totalLessons > 0
            ? Math.round((newCompletedIds.length / totalLessons) * 100)
            : 0;

        setCompletedLessonIds(newCompletedIds);
        setProgress(newProgress);

        try {
            const response = await api.post(`/student/progress/${lessonId}`, {
                completed: !currentlyCompleted
            });

            // Update progress from server response to ensure accuracy
            if (response.data.courseProgress !== undefined) {
                setProgress(response.data.courseProgress);
            }

            toast.success(
                currentlyCompleted
                    ? 'Lesson unmarked as complete'
                    : 'Lesson marked as complete'
            );
        } catch (err) {
            console.error('Error saving lesson progress:', err);

            // Rollback optimistic update on error
            setCompletedLessonIds(previousCompletedIds);
            setProgress(previousProgress);

            toast.error(
                err.response?.data?.error || 'Failed to save lesson progress. Please try again.'
            );
        } finally {
            setTogglingLessonId(null);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!course) return <div className="text-center py-10">Course not found</div>;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="gradient-primary text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                        <p className="text-xl mb-6 text-white/90">{course.description}</p>
                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{course.rating || 'New'}</span>
                                {course._count?.reviews > 0 && <span>({course._count.reviews} reviews)</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                <span>{(course._count?.enrollments || 0).toLocaleString()} students</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                <span>{totalLessons} lessons</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                <span>{course.duration || 'Self-paced'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* What You'll Learn */}
                        {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>What you'll learn</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {course.whatYouWillLearn.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tabs for Content & Quizzes */}
                        <Tabs defaultValue="content" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8">
                                <TabsTrigger value="content">Course Content</TabsTrigger>
                                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                            </TabsList>

                            <TabsContent value="content">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Course Content</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {totalLessons} lessons • {course.sections?.length || 0} sections
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        {course.sections && course.sections.length > 0 ? (
                                            <div className="space-y-2">
                                                {course.sections.map((section, secIdx) => (
                                                    <div key={section.id || secIdx} className="border rounded-lg">
                                                        <button
                                                            onClick={() => toggleSection(secIdx)}
                                                            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {expandedSections.includes(secIdx) ? (
                                                                    <ChevronUp className="h-5 w-5" />
                                                                ) : (
                                                                    <ChevronDown className="h-5 w-5" />
                                                                )}
                                                                <div className="text-left">
                                                                    <p className="font-semibold">{section.title}</p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {section.lessons?.length || 0} lessons
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                        {expandedSections.includes(secIdx) && (
                                                            <div className="border-t">
                                                                {section.lessons?.map((lesson) => (
                                                                    <div
                                                                        key={lesson.id}
                                                                        className="p-4 flex items-center justify-between hover:bg-muted/30 border-b last:border-0"
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            {lesson.preview || (enrolled && isPaid) ? (
                                                                                <PlayCircle className="h-5 w-5 text-primary" />
                                                                            ) : (
                                                                                <Lock className="h-5 w-5 text-muted-foreground" />
                                                                            )}
                                                                            <span>{lesson.title}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                                                                            {(lesson.preview || (enrolled && isPaid)) && (
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="ghost"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        navigate(`/student/course/${id}/lesson/${lesson.id}`);
                                                                                    }}
                                                                                >
                                                                                    {enrolled && isPaid ? 'Play' : 'Preview'}
                                                                                </Button>
                                                                            )}
                                                                            {/* Lesson Completion Toggle */}
                                                                            {enrolled && isPaid && (
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant={completedLessonIds.includes(lesson.id) ? 'default' : 'outline'}
                                                                                    disabled={togglingLessonId === lesson.id}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        toggleLessonCompletion(lesson.id);
                                                                                    }}
                                                                                >
                                                                                    {togglingLessonId === lesson.id
                                                                                        ? 'Saving...'
                                                                                        : completedLessonIds.includes(lesson.id)
                                                                                            ? 'Unmark Complete'
                                                                                            : 'Mark Complete'
                                                                                    }
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">Curriculum details coming soon...</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="quizzes">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Course Quizzes</CardTitle>
                                        <CardDescription>Test your knowledge with these quizzes.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {!enrolled ? (
                                            <div className="text-center py-8">
                                                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                                <p className="text-muted-foreground">Enroll in the course to access quizzes.</p>
                                            </div>
                                        ) : quizzes.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-muted-foreground">No quizzes available for this course yet.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {quizzes.map((quiz) => (
                                                    <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="bg-primary/10 p-3 rounded-full">
                                                                <Trophy className="h-6 w-6 text-primary" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-lg">{quiz.title}</h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {quiz.lesson ? `Lesson: ${quiz.lesson.title}` : 'Course Assessment'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            {quiz.attempts && quiz.attempts.length > 0 && (
                                                                <div className="text-right mr-4">
                                                                    <p className="text-sm font-medium">Best Score</p>
                                                                    <p className="text-lg font-bold text-primary">{quiz.attempts[0].score} pts</p>
                                                                </div>
                                                            )}
                                                            <Button onClick={() => navigate(`/student/quiz/${quiz.id}`)}>
                                                                {quiz.attempts?.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* Requirements */}
                        {course.requirements && course.requirements.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Requirements</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {course.requirements.map((req, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{course.description}</p>
                            </CardContent>
                        </Card>

                        {/* Instructor */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Instructor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-semibold">
                                        {instructorAvatar}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">{instructorName}</h3>
                                        {typeof course.instructor === 'object' && (
                                            <>
                                                <p className="text-muted-foreground mb-3">{course.instructor.bio || 'Experienced Instructor'}</p>
                                                <div className="flex gap-4 text-sm">
                                                    <div>
                                                        <BookOpen className="h-4 w-4 inline mr-1" />
                                                        <span className="font-semibold">{course.instructor._count?.courses || 1}</span> courses
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="p-6 space-y-4">
                                {/* Enrollment / Payment */}
                                {!enrolled ? (
                                    <Button className="w-full gradient-primary text-white border-0" onClick={handleEnroll} disabled={enrolling}>
                                        {enrolling ? 'Enrolling...' : 'Enroll Now'}
                                    </Button>
                                ) : !isPaid ? (
                                    <Button className="w-full gradient-primary text-white border-0" onClick={handlePaymentClick}>
                                        Complete Payment
                                    </Button>
                                ) : (
                                    <>
                                        <Button className="w-full gradient-primary text-white border-0" onClick={() => navigate(`/student/course/${id}/lesson/${course.sections?.[0]?.lessons?.[0]?.id}`)}>
                                            Continue Learning
                                        </Button>
                                        <div className="mt-4">
                                            <Progress value={progress} className="w-full" />
                                            <p className="text-sm text-muted-foreground mt-1">{progress}% completed</p>
                                        </div>
                                        <Button
                                            variant={isCompleted ? 'outline' : 'default'}
                                            className="w-full mt-2"
                                            onClick={toggleCourseCompletion}
                                            disabled={togglingCompletion}
                                        >
                                            {isCompleted ? 'Unmark as Complete' : 'Mark as Complete'}
                                        </Button>
                                        {isCompleted && (
                                            <Alert className="mt-2">
                                                <AlertDescription>
                                                    Completed on {new Date(completedAt).toLocaleDateString()}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        {course.certificate && (
                                            <Button className="w-full mt-2" onClick={() => toast.info('Certificate download not implemented')}>Get Certificate</Button>
                                        )}
                                    </>
                                )}

                                {/* Course Features */}
                                <div className="space-y-3 pt-4 border-t">
                                    <h4 className="font-semibold">This course includes:</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{course.duration || 'Self-paced'} on-demand video</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" />
                                            <span>{totalLessons} lessons</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Award className="h-4 w-4" />
                                            <span>{course.certificate ? 'Certificate of Completion' : 'No certificate'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span>Lifetime access</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Complete Payment</DialogTitle>
                        <DialogDescription>Enter your payment details to unlock this course.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={processPayment} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Cardholder Name</Label>
                            <Input id="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="card">Card Number</Label>
                            <Input id="card" placeholder="0000 0000 0000 0000" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM/YY" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input id="cvc" placeholder="123" required />
                            </div>
                        </div>
                        <div className="pt-4">
                            <div className="flex justify-between items-center mb-4 font-semibold">
                                <span>Total Amount:</span>
                                <span className="text-xl">₹{course.price}</span>
                            </div>
                            <Button type="submit" className="w-full gradient-primary text-white border-0" disabled={processingPayment}>
                                {processingPayment ? 'Processing...' : 'Pay Now'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default CourseDetails;
