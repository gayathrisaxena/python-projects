import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, Database, Mail, Bell, Shield } from 'lucide-react';
import { toast } from "sonner";

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        platformName: 'EduMaster',
        platformEmail: 'support@edumaster.com',
        allowRegistration: true,
        requireEmailVerification: true,
        enableCertificates: true,
        enableQuizzes: true,
        enableComments: true,
        maintenanceMode: false,
        maxUploadSize: '100',
        sessionTimeout: '30',
    });

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        toast.success('✅ Settings saved successfully!');
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">System Settings</h1>
                    <p className="text-muted-foreground">Configure platform settings and preferences</p>
                </div>

                <div className="space-y-6">
                    {/* General Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                General Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="platformName">Platform Name</Label>
                                <Input
                                    id="platformName"
                                    value={settings.platformName}
                                    onChange={(e) => handleChange('platformName', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="platformEmail">Support Email</Label>
                                <Input
                                    id="platformEmail"
                                    type="email"
                                    value={settings.platformEmail}
                                    onChange={(e) => handleChange('platformEmail', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                User Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="allowRegistration">Allow New Registrations</Label>
                                    <p className="text-sm text-muted-foreground">Enable users to create new accounts</p>
                                </div>
                                <Switch
                                    id="allowRegistration"
                                    checked={settings.allowRegistration}
                                    onCheckedChange={(checked) => handleChange('allowRegistration', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                                    <p className="text-sm text-muted-foreground">Users must verify email before accessing platform</p>
                                </div>
                                <Switch
                                    id="requireEmailVerification"
                                    checked={settings.requireEmailVerification}
                                    onCheckedChange={(checked) => handleChange('requireEmailVerification', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Feature Toggles */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Feature Toggles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="enableCertificates">Enable Certificates</Label>
                                    <p className="text-sm text-muted-foreground">Allow students to earn certificates</p>
                                </div>
                                <Switch
                                    id="enableCertificates"
                                    checked={settings.enableCertificates}
                                    onCheckedChange={(checked) => handleChange('enableCertificates', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="enableQuizzes">Enable Quizzes</Label>
                                    <p className="text-sm text-muted-foreground">Allow instructors to create quizzes</p>
                                </div>
                                <Switch
                                    id="enableQuizzes"
                                    checked={settings.enableQuizzes}
                                    onCheckedChange={(checked) => handleChange('enableQuizzes', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="enableComments">Enable Comments</Label>
                                    <p className="text-sm text-muted-foreground">Allow students to comment on lessons</p>
                                </div>
                                <Switch
                                    id="enableComments"
                                    checked={settings.enableComments}
                                    onCheckedChange={(checked) => handleChange('enableComments', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                System Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                                <Input
                                    id="maxUploadSize"
                                    type="number"
                                    value={settings.maxUploadSize}
                                    onChange={(e) => handleChange('maxUploadSize', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                                <Input
                                    id="sessionTimeout"
                                    type="number"
                                    value={settings.sessionTimeout}
                                    onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div>
                                    <Label htmlFor="maintenanceMode" className="text-yellow-900">Maintenance Mode</Label>
                                    <p className="text-sm text-yellow-800">Platform will be inaccessible to users</p>
                                </div>
                                <Switch
                                    id="maintenanceMode"
                                    checked={settings.maintenanceMode}
                                    onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notification Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email Notifications</Label>
                                <div className="space-y-2 pl-4">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="newEnrollment" defaultChecked />
                                        <Label htmlFor="newEnrollment" className="font-normal">New course enrollments</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="courseCompletion" defaultChecked />
                                        <Label htmlFor="courseCompletion" className="font-normal">Course completions</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="newReview" defaultChecked />
                                        <Label htmlFor="newReview" className="font-normal">New course reviews</Label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end gap-3">
                        <Button variant="outline">Reset to Defaults</Button>
                        <Button onClick={handleSave} className="gradient-primary text-white border-0">
                            <Save className="h-4 w-4 mr-2" />
                            Save Settings
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
