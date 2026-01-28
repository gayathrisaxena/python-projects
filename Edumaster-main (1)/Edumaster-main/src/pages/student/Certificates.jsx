import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import mockData from '@/data/mockData';
import { Award, Download, Share2, Calendar } from 'lucide-react';
import { toast } from "sonner";

const Certificates = () => {
    const navigate = useNavigate();

    // Mock certificates data
    const certificates = [
        {
            id: 1,
            courseTitle: 'HTML & CSS Foundations',
            completedDate: '2024-01-20',
            certificateId: 'CERT-2024-001',
            instructor: 'John Doe',
            grade: 'A+'
        },
        {
            id: 2,
            courseTitle: 'Full Stack Development',
            completedDate: '2024-02-16',
            certificateId: 'CERT-2024-002',
            instructor: 'John Doe',
            grade: 'A'
        },
    ];

    const handleDownload = (cert) => {
        // In a real app, this would generate and download a PDF
        toast.info(`📥 Downloading certificate for ${cert.courseTitle}...`);
    };

    const handleShare = (cert) => {
        // In a real app, this would open a share dialog
        const shareText = `I just completed ${cert.courseTitle} on EduMaster! Certificate ID: ${cert.certificateId}`;
        if (navigator.share) {
            navigator.share({
                title: 'My Certificate',
                text: shareText,
            }).catch(() => {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(shareText);
                toast.success('📋 Certificate link copied to clipboard!');
            });
        } else {
            navigator.clipboard.writeText(shareText);
            toast.success('📋 Certificate link copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">My Certificates</h1>
                    <p className="text-muted-foreground">View and download your course completion certificates</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <Card key={cert.id} className="card-hover">
                            <CardHeader className="gradient-primary text-white">
                                <div className="flex items-center justify-center mb-4">
                                    <Award className="h-16 w-16" />
                                </div>
                                <CardTitle className="text-center text-white">Certificate of Completion</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="text-center mb-4">
                                    <h3 className="font-bold text-lg mb-2">{cert.courseTitle}</h3>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Instructor: {cert.instructor}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Completed: {new Date(cert.completedDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Certificate ID: {cert.certificateId}
                                    </p>
                                    <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mt-2">
                                        Grade: {cert.grade}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleDownload(cert)}
                                        className="flex-1 gradient-primary text-white border-0"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                    <Button
                                        onClick={() => handleShare(cert)}
                                        variant="outline"
                                        size="icon"
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Placeholder for available certificates */}
                    <Card className="border-dashed border-2">
                        <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <Award className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-2">Complete more courses to earn certificates</p>
                            <Button
                                variant="link"
                                onClick={() => navigate('/')}
                            >
                                Browse Courses
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Certificates;
