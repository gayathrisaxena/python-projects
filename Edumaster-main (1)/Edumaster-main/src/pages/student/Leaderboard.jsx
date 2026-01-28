import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal } from 'lucide-react';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get('/leaderboard');
                setLeaderboard(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto p-6 max-w-4xl pt-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 gradient-text">Top Performers</h1>
                    <p className="text-muted-foreground text-lg">See who's leading the charts this week!</p>
                </div>

                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                    <CardHeader className="border-b bg-muted/20">
                        <div className="flex items-center justify-between px-4">
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-6 w-6 text-yellow-500" />
                                Global Leaderboard
                            </CardTitle>
                            <span className="text-sm text-muted-foreground">Updated in real-time</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {leaderboard.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No quiz attempts yet. Be the first!
                            </div>
                        ) : (
                            <div className="divide-y">
                                {leaderboard.map((user, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-6 hover:bg-muted/30 transition-colors ${index < 3 ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="flex-shrink-0 w-8 text-center font-bold text-xl text-muted-foreground">
                                                {index === 0 && <Medal className="h-8 w-8 text-yellow-500 mx-auto" />}
                                                {index === 1 && <Medal className="h-8 w-8 text-gray-400 mx-auto" />}
                                                {index === 2 && <Medal className="h-8 w-8 text-amber-600 mx-auto" />}
                                                {index > 2 && `#${index + 1}`}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                        {user.name?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{user.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary">{user.totalScore}</p>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Points</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Leaderboard;
