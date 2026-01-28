import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Trophy, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

const QuizAttempt = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const endpoint = quizId === 'weekly' ? '/quizzes/weekly' : `/quizzes/${quizId}`;
                const response = await api.get(endpoint);
                setQuiz(response.data);
            } catch (err) {
                console.error('Error fetching quiz:', err);
                setError(err.response?.data?.error || 'Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const response = await api.post(`/quizzes/${quiz.id}/submit`, { answers });
            setResult(response.data);
            if (response.data.passed) {
                toast.success('🎉 Quiz passed! Great job!');
            } else {
                toast.warning('⚠️ Quiz completed, but you didn\'t pass. Keep practicing!');
            }
        } catch (err) {
            console.error('Error submitting quiz:', err);
            toast.error('❌ Failed to submit quiz. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[80vh]">
                    <p className="text-red-500 mb-4 text-xl">{error}</p>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="p-8 text-center">Quiz not found</div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto p-6 max-w-2xl pt-10">
                    <Card className="border-2 border-primary/10 shadow-xl">
                        <CardHeader className="text-center pb-2">
                            <Trophy className={`h-20 w-20 mx-auto mb-4 ${result.passed ? 'text-yellow-500' : 'text-gray-400'}`} />
                            <CardTitle className="text-3xl font-bold">Quiz Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 text-center">
                            <div>
                                <p className="text-6xl font-bold mb-2 gradient-text">{result.score} / {result.totalPoints}</p>
                                <p className={`text-xl font-medium ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                                    {result.passed ? 'Congratulations! You Passed!' : 'Keep practicing! You can do better.'}
                                </p>
                            </div>
                            <div className="flex justify-center gap-4">
                                <Button onClick={() => navigate(-1)} variant="outline" className="w-32">Back</Button>
                                <Button onClick={() => window.location.reload()} className="gradient-primary text-white w-32">Retry</Button>
                                <Button onClick={() => navigate('/student/leaderboard')} className="gradient-primary text-white w-32 ml-2">View Leaderboard</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-6 max-w-3xl pt-10">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
                    {quiz.description && <p className="text-muted-foreground text-lg">{quiz.description}</p>}
                </div>
                <div className="space-y-6">
                    {quiz.questions.map((q, index) => (
                        <Card key={q.id} className="border-l-4 border-l-primary">
                            <CardHeader>
                                <CardTitle className="text-lg font-medium">
                                    <span className="text-primary mr-2">Q{index + 1}.</span> {q.question}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={answers[q.id] || ""}
                                    onValueChange={val => handleAnswerChange(q.id, val)}
                                    className="space-y-3"
                                >
                                    {q.options.map((option, optIndex) => (
                                        <div key={optIndex} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                            <RadioGroupItem value={option} id={`${q.id}-${optIndex}`} />
                                            <Label htmlFor={`${q.id}-${optIndex}`} className="flex-grow cursor-pointer font-normal text-base">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    ))}
                    <div className="flex justify-end pt-4 pb-12">
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting || Object.keys(answers).length < quiz.questions.length}
                            className="gradient-primary text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                        >
                            {submitting ? 'Submitting...' : 'Submit Quiz'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizAttempt;
