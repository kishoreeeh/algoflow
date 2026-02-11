import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL, getAuthHeaders } from '../../config/api';

/**
 * Streak Calendar - GitHub-style contribution graph
 */
const StreakCalendar = () => {
    const { user } = useAuth();
    const [activityData, setActivityData] = useState([]);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivityData();
    }, []);

    const fetchActivityData = async () => {
        try {
            const response = await axios.get(`${API_URL}/analytics/activity`, {
                headers: getAuthHeaders()
            });
            setActivityData(response.data.activity || []);
            setCurrentStreak(response.data.currentStreak || 0);
            setLongestStreak(response.data.longestStreak || 0);
        } catch (error) {
            console.error('Error fetching activity:', error);
            // Generate mock data for demonstration
            setActivityData(generateMockActivity());
            setCurrentStreak(7);
            setLongestStreak(15);
        } finally {
            setLoading(false);
        }
    };

    const generateMockActivity = () => {
        const data = [];
        const today = new Date();
        for (let i = 365; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0
            });
        }
        return data;
    };

    const getActivityLevel = (count) => {
        if (count === 0) return 'bg-[#1a1f2e]';
        if (count <= 1) return 'bg-blue-900/30';
        if (count <= 3) return 'bg-blue-700/50';
        if (count <= 5) return 'bg-blue-500/70';
        return 'bg-blue-400';
    };

    const renderCalendar = () => {
        const weeks = [];
        let currentWeek = [];

        activityData.forEach((day, index) => {
            currentWeek.push(day);
            if (currentWeek.length === 7 || index === activityData.length - 1) {
                weeks.push([...currentWeek]);
                currentWeek = [];
            }
        });

        return (
            <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-2">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((day, dayIndex) => (
                            <div
                                key={dayIndex}
                                className={`w-3 h-3 rounded-sm ${getActivityLevel(day.count)} hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer`}
                                title={`${day.date}: ${day.count} activities`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="card">
                <div className="skeleton h-32 w-full" />
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#f1f5f9]">Learning Activity</h3>
                <div className="flex gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{currentStreak}</div>
                        <div className="text-xs text-[#94a3b8]">Day Streak</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[#f1f5f9]">{longestStreak}</div>
                        <div className="text-xs text-[#94a3b8]">Best Streak</div>
                    </div>
                </div>
            </div>

            {renderCalendar()}

            <div className="flex items-center gap-2 mt-4 text-xs text-[#94a3b8]">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-[#1a1f2e]" />
                    <div className="w-3 h-3 rounded-sm bg-blue-900/30" />
                    <div className="w-3 h-3 rounded-sm bg-blue-700/50" />
                    <div className="w-3 h-3 rounded-sm bg-blue-500/70" />
                    <div className="w-3 h-3 rounded-sm bg-blue-400" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

/**
 * Progress Charts - Visual representation of learning progress
 */
const ProgressCharts = () => {
    const [stats, setStats] = useState({
        algorithmsCompleted: 0,
        totalAlgorithms: 50,
        timeSpent: 0,
        averageScore: 0,
        categoryProgress: []
    });

    useEffect(() => {
        fetchProgressStats();
    }, []);

    const fetchProgressStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/analytics/progress`, {
                headers: getAuthHeaders()
            });
            setStats(response.data);
        } catch (error) {
            // Mock data
            setStats({
                algorithmsCompleted: 12,
                totalAlgorithms: 50,
                timeSpent: 2450, // minutes
                averageScore: 87,
                categoryProgress: [
                    { category: 'Sorting', completed: 5, total: 8, percentage: 62.5 },
                    { category: 'Searching', completed: 2, total: 5, percentage: 40 },
                    { category: 'Trees', completed: 3, total: 10, percentage: 30 },
                    { category: 'Graphs', completed: 2, total: 8, percentage: 25 },
                    { category: 'Dynamic Programming', completed: 0, total: 12, percentage: 0 }
                ]
            });
        }
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                        {stats.algorithmsCompleted}/{stats.totalAlgorithms}
                    </div>
                    <div className="text-sm text-[#94a3b8]">Algorithms Completed</div>
                    <div className="mt-3 h-2 bg-[#1a1f2e] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                            style={{ width: `${(stats.algorithmsCompleted / stats.totalAlgorithms) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="card text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">
                        {formatTime(stats.timeSpent)}
                    </div>
                    <div className="text-sm text-[#94a3b8]">Total Time Spent</div>
                </div>

                <div className="card text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">
                        {stats.averageScore}%
                    </div>
                    <div className="text-sm text-[#94a3b8]">Average Score</div>
                </div>
            </div>

            {/* Category Progress */}
            <div className="card">
                <h3 className="text-xl font-bold text-[#f1f5f9] mb-6">Progress by Category</h3>
                <div className="space-y-4">
                    {stats.categoryProgress.map((category, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[#f1f5f9]">{category.category}</span>
                                <span className="text-sm text-[#94a3b8]">
                                    {category.completed}/{category.total} ({Math.round(category.percentage)}%)
                                </span>
                            </div>
                            <div className="h-2 bg-[#1a1f2e] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                                    style={{ width: `${category.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * Mastery Levels - Show proficiency in each algorithm
 */
const MasteryLevels = () => {
    const [masteryData, setMasteryData] = useState([]);

    useEffect(() => {
        // Mock data - replace with API call
        setMasteryData([
            { algorithm: 'Bubble Sort', level: 'Expert', score: 95, attempts: 5 },
            { algorithm: 'Quick Sort', level: 'Advanced', score: 82, attempts: 3 },
            { algorithm: 'Binary Search', level: 'Intermediate', score: 70, attempts: 2 },
            { algorithm: 'Merge Sort', level: 'Beginner', score: 45, attempts: 1 },
        ]);
    }, []);

    const getLevelColor = (level) => {
        switch (level) {
            case 'Expert': return 'text-green-400 bg-green-600/10 border-green-600/20';
            case 'Advanced': return 'text-blue-400 bg-blue-600/10 border-blue-600/20';
            case 'Intermediate': return 'text-yellow-400 bg-yellow-600/10 border-yellow-600/20';
            case 'Beginner': return 'text-gray-400 bg-gray-600/10 border-gray-600/20';
            default: return 'text-gray-400 bg-gray-600/10 border-gray-600/20';
        }
    };

    return (
        <div className="card">
            <h3 className="text-xl font-bold text-[#f1f5f9] mb-6">Mastery Levels</h3>
            <div className="space-y-3">
                {masteryData.map((item, index) => (
                    <div key={index} className="card-hover p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-[#f1f5f9]">{item.algorithm}</span>
                            <span className={`badge ${getLevelColor(item.level)}`}>
                                {item.level}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[#94a3b8]">
                            <span>Score: {item.score}%</span>
                            <span>•</span>
                            <span>{item.attempts} attempts</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { StreakCalendar, ProgressCharts, MasteryLevels };
