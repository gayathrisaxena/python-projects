import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '@/services/api';
import CurriculumEditor from '@/components/instructor/CurriculumEditor';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [course, setCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        level: 'BEGINNER',
        price: 0,
        thumbnail: '',
        published: false
    });

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const response = await api.get(`/courses/${id}`);
            const data = response.data;
            setCourse(data);
            setFormData({
                title: data.title,
                description: data.description,
                category: data.category,
                level: data.level,
                price: data.price,
                thumbnail: data.thumbnail || '',
                published: data.published
            });
        } catch (error) {
            console.error('Error fetching course:', error);
            // Handle error (e.g., redirect if not found)
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/instructor/courses/${id}`, {
                ...formData,
                price: parseFloat(formData.price)
            });
            toast.success('✅ Course updated successfully!');
            fetchCourse(); // Refresh data
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error('❌ Failed to update course. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto p-8">
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-muted-foreground">Course not found</p>
                            <Button onClick={() => navigate('/instructor/courses')} className="mt-4">
                                Back to Courses
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/instructor/courses')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-4xl font-bold">Edit Course</h1>
                            <p className="text-muted-foreground">Update course details and content</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="published">Published</Label>
                            <input
                                type="checkbox"
                                id="published"
                                checked={formData.published}
                                onChange={(e) => handleChange('published', e.target.checked)}
                                className="h-4 w-4"
                            />
                        </div>
                        <Button onClick={handleSave} disabled={saving} className="gradient-primary text-white border-0">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Course Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    placeholder="e.g., Introduction to React"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={5}
                                    placeholder="Describe what students will learn..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => handleChange('category', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="level">Level</Label>
                                    <Select value={formData.level} onValueChange={(value) => handleChange('level', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BEGINNER">Beginner</SelectItem>
                                            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (₹)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleChange('price', e.target.value)}
                                        placeholder="0 for free"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                                    <Input
                                        id="thumbnail"
                                        value={formData.thumbnail}
                                        onChange={(e) => handleChange('thumbnail', e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Curriculum */}
                    <CurriculumEditor
                        courseId={id}
                        sections={course.sections || []}
                        onUpdate={fetchCourse}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditCourse;
