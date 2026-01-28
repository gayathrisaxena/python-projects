import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'How do I enroll in a course?',
            answer: 'Simply browse our course catalog, select the course you\'re interested in, and click the "Enroll Now" button. For paid courses, you\'ll be directed to the payment page. For free courses, you\'ll be enrolled immediately.'
        },
        {
            question: 'Can I get a refund if I\'m not satisfied?',
            answer: 'Yes! We offer a 30-day money-back guarantee on all paid courses. If you\'re not satisfied with your purchase, simply contact our support team within 30 days of enrollment for a full refund.'
        },
        {
            question: 'How long do I have access to a course?',
            answer: 'Once you enroll in a course, you have lifetime access to all course materials. You can learn at your own pace and revisit the content whenever you need.'
        },
        {
            question: 'Do I get a certificate upon completion?',
            answer: 'Yes! Upon successfully completing a course (including all lessons and quizzes), you\'ll receive a certificate of completion that you can download and share on LinkedIn or your resume.'
        },
        {
            question: 'Can I download course videos?',
            answer: 'Course videos are available for streaming only to protect our instructors\' content. However, you can access them anytime with an internet connection.'
        },
        {
            question: 'What if I have questions during the course?',
            answer: 'Each course has a Q&A section where you can ask questions. Our instructors and teaching assistants actively monitor and respond to student questions. You can also use our ChatGPT assistant for instant help.'
        },
        {
            question: 'How do I become an instructor?',
            answer: 'To become an instructor, register for an instructor account and submit your course proposal. Our team will review it and get back to you within 3-5 business days.'
        },
        {
            question: 'Are there any prerequisites for courses?',
            answer: 'Prerequisites vary by course. Each course page lists the required knowledge and skills. Make sure to review these before enrolling to ensure you\'re prepared.'
        },
        {
            question: 'Can I switch between student and instructor accounts?',
            answer: 'Yes! You can have both roles on the same account. Simply navigate to your profile settings to switch between student and instructor views.'
        },
        {
            question: 'How are quizzes graded?',
            answer: 'Most quizzes are auto-graded and you\'ll receive instant feedback. For assignment-based assessments, instructors will grade and provide feedback within 5-7 business days.'
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-8 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-muted-foreground text-lg">
                        Find answers to common questions about EduMaster
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <Card key={index} className="overflow-hidden">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                            >
                                <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                                {openIndex === index ? (
                                    <ChevronUp className="h-5 w-5 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 flex-shrink-0" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6 border-t">
                                    <p className="text-muted-foreground pt-4 leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                <Card className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5">
                    <CardContent className="p-8 text-center">
                        <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
                        <p className="text-muted-foreground mb-4">
                            Can't find the answer you're looking for? Please contact our support team.
                        </p>
                        <a href="/contact">
                            <button className="gradient-primary text-white px-6 py-2 rounded-md border-0">
                                Contact Support
                            </button>
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FAQ;
