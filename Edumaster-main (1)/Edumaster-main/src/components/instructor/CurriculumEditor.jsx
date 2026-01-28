import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, Edit, Video, GripVertical, Check, X } from 'lucide-react';
import api from '@/services/api';
import { Alert, AlertDescription } from "@/components/ui/alert";

const CurriculumEditor = ({ courseId, sections, onUpdate }) => {
    const [addingSection, setAddingSection] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [editingSection, setEditingSection] = useState(null);
    const [addingLesson, setAddingLesson] = useState(null); // sectionId
    const [newLesson, setNewLesson] = useState({ title: '', description: '', videoUrl: '', duration: '', preview: false });

    const handleAddSection = async () => {
        if (!newSectionTitle.trim()) return;
        try {
            await api.post(`/instructor/courses/${courseId}/sections`, {
                title: newSectionTitle,
                order: sections.length + 1
            });
            setNewSectionTitle('');
            setAddingSection(false);
            onUpdate();
        } catch (error) {
            console.error('Error adding section:', error);
        }
    };

    const handleDeleteSection = async (sectionId) => {
        if (!confirm('Delete this section and all its lessons?')) return;
        try {
            await api.delete(`/instructor/courses/${courseId}/sections/${sectionId}`);
            onUpdate();
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    const handleAddLesson = async (sectionId) => {
        try {
            await api.post(`/instructor/courses/${courseId}/sections/${sectionId}/lessons`, {
                ...newLesson,
                order: 999 // Backend should handle or we calculate
            });
            setNewLesson({ title: '', description: '', videoUrl: '', duration: '', preview: false });
            setAddingLesson(null);
            onUpdate();
        } catch (error) {
            console.error('Error adding lesson:', error);
        }
    };

    const handleDeleteLesson = async (sectionId, lessonId) => {
        if (!confirm('Delete this lesson?')) return;
        try {
            await api.delete(`/instructor/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
            onUpdate();
        } catch (error) {
            console.error('Error deleting lesson:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Curriculum</h2>
                <Button onClick={() => setAddingSection(true)} disabled={addingSection}>
                    <Plus className="h-4 w-4 mr-2" /> Add Section
                </Button>
            </div>

            {addingSection && (
                <Card className="border-dashed border-2">
                    <CardContent className="p-4 flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label>Section Title</Label>
                            <Input
                                value={newSectionTitle}
                                onChange={(e) => setNewSectionTitle(e.target.value)}
                                placeholder="e.g., Introduction"
                            />
                        </div>
                        <Button onClick={handleAddSection}>Save</Button>
                        <Button variant="ghost" onClick={() => setAddingSection(false)}>Cancel</Button>
                    </CardContent>
                </Card>
            )}

            <Accordion type="single" collapsible className="space-y-4">
                {sections.map((section) => (
                    <AccordionItem key={section.id} value={`section-${section.id}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                                <span className="font-semibold text-lg">{section.title}</span>
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteSection(section.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                            {section.lessons && section.lessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                    <div className="flex items-center gap-3">
                                        <Video className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{lesson.title}</p>
                                            <p className="text-xs text-muted-foreground">{lesson.duration} • {lesson.preview ? 'Free Preview' : 'Locked'}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteLesson(section.id, lesson.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            {addingLesson === section.id ? (
                                <Card className="mt-4">
                                    <CardContent className="p-4 space-y-4">
                                        <div className="space-y-2">
                                            <Label>Lesson Title</Label>
                                            <Input
                                                value={newLesson.title}
                                                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Input
                                                value={newLesson.description}
                                                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Video URL (YouTube Embed)</Label>
                                                <Input
                                                    value={newLesson.videoUrl}
                                                    onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                                                    placeholder="https://www.youtube.com/embed/..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Duration</Label>
                                                <Input
                                                    value={newLesson.duration}
                                                    onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                                                    placeholder="e.g., 10 min"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="preview"
                                                checked={newLesson.preview}
                                                onChange={(e) => setNewLesson({ ...newLesson, preview: e.target.checked })}
                                            />
                                            <Label htmlFor="preview">Free Preview</Label>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleAddLesson(section.id)}>Add Lesson</Button>
                                            <Button variant="ghost" onClick={() => setAddingLesson(null)}>Cancel</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Button variant="outline" className="w-full" onClick={() => setAddingLesson(section.id)}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Lesson
                                </Button>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default CurriculumEditor;
