import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Achievement Badge Component
 */
const AchievementBadge = ({ achievement, unlocked = false, progress = 0 }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div
            className={`card-hover p-4 relative ${unlocked ? 'opacity-100' : 'opacity-40'}`}
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
        >
            <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${unlocked ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-[#252b3b]'
                    }`}>
                    {achievement.icon}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-[#f1f5f9] mb-1">{achievement.name}</h4>
                    <p className="text-sm text-[#94a3b8]">{achievement.description}</p>
                    {!unlocked && achievement.requirement && (
                        <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-1">
                                <span>Progress</span>
                                <span>{progress}/{achievement.requirement}</span>
                            </div>
                            <div className="h-1.5 bg-[#1a1f2e] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                                    style={{ width: `${(progress / achievement.requirement) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
                {unlocked && (
                    <div className="text-green-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

            {showDetails && unlocked && achievement.unlockedDate && (
                <div className="absolute top-full left-0 right-0 mt-2 card p-3 z-10 animate-fade-in">
                    <p className="text-xs text-[#94a3b8]">
                        Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-blue-400 mt-1">+{achievement.points} points</p>
                </div>
            )}
        </div>
    );
};

/**
 * Level Progress Component
 */
const LevelProgress = ({ currentLevel, currentXP, nextLevelXP, totalXP }) => {
    const progress = (currentXP / nextLevelXP) * 100;

    return (
        <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-[#f1f5f9] mb-1">Level {currentLevel}</h3>
                    <p className="text-sm text-[#94a3b8]">{totalXP.toLocaleString()} total XP</p>
                </div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{currentLevel}</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[#cbd5e1]">Progress to Level {currentLevel + 1}</span>
                    <span className="text-blue-400 font-semibold">
                        {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
                    </span>
                </div>
                <div className="h-3 bg-[#1a1f2e] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transition-all duration-500 relative overflow-hidden"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                </div>
                <p className="text-xs text-[#94a3b8] text-right">
                    {(nextLevelXP - currentXP).toLocaleString()} XP to next level
                </p>
            </div>

            {/* Level Perks */}
            <div className="mt-6 pt-6 border-t border-[rgba(226,232,240,0.08)]">
                <h4 className="text-sm font-semibold text-[#f1f5f9] mb-3">Level Perks</h4>
                <div className="space-y-2">
                    {getLevelPerks(currentLevel).map((perk, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-[#cbd5e1]">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{perk}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * Achievements Grid Component
 */
const AchievementsGrid = () => {
    const { user } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [userProgress, setUserProgress] = useState({});

    useEffect(() => {
        loadAchievements();
    }, []);

    const loadAchievements = () => {
        // Mock data - replace with API call
        const allAchievements = [
            {
                id: 'first_algorithm',
                name: 'First Steps',
                description: 'Complete your first algorithm',
                icon: '🎯',
                points: 50,
                requirement: 1,
                category: 'learning'
            },
            {
                id: 'week_streak',
                name: 'Consistent Learner',
                description: 'Maintain a 7-day learning streak',
                icon: '🔥',
                points: 100,
                requirement: 7,
                category: 'streak'
            },
            {
                id: 'perfect_quiz',
                name: 'Perfect Score',
                description: 'Score 100% on any quiz',
                icon: '💯',
                points: 75,
                requirement: 1,
                category: 'quiz'
            },
            {
                id: 'sorting_master',
                name: 'Sorting Master',
                description: 'Complete all sorting algorithms',
                icon: '🏆',
                points: 200,
                requirement: 8,
                category: 'mastery'
            },
            {
                id: 'speed_demon',
                name: 'Speed Demon',
                description: 'Complete an algorithm in under 5 minutes',
                icon: '⚡',
                points: 150,
                requirement: 1,
                category: 'speed'
            },
            {
                id: 'helper',
                name: 'Community Helper',
                description: 'Help 10 other students in forums',
                icon: '🤝',
                points: 125,
                requirement: 10,
                category: 'social'
            },
            {
                id: 'month_streak',
                name: 'Dedicated Student',
                description: 'Maintain a 30-day learning streak',
                icon: '🌟',
                points: 300,
                requirement: 30,
                category: 'streak'
            },
            {
                id: 'all_algorithms',
                name: 'Algorithm Expert',
                description: 'Complete all 50 algorithms',
                icon: '👑',
                points: 1000,
                requirement: 50,
                category: 'mastery'
            }
        ];

        const progress = {
            first_algorithm: { unlocked: true, progress: 1, unlockedDate: '2026-01-15' },
            week_streak: { unlocked: true, progress: 7, unlockedDate: '2026-01-20' },
            perfect_quiz: { unlocked: false, progress: 0 },
            sorting_master: { unlocked: false, progress: 5 },
            speed_demon: { unlocked: false, progress: 0 },
            helper: { unlocked: false, progress: 3 },
            month_streak: { unlocked: false, progress: 12 },
            all_algorithms: { unlocked: false, progress: 12 }
        };

        setAchievements(allAchievements);
        setUserProgress(progress);
    };

    const unlockedCount = Object.values(userProgress).filter(p => p.unlocked).length;
    const totalPoints = achievements
        .filter(a => userProgress[a.id]?.unlocked)
        .reduce((sum, a) => sum + a.points, 0);

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card text-center p-6">
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                        {unlockedCount}/{achievements.length}
                    </div>
                    <div className="text-sm text-[#94a3b8]">Achievements Unlocked</div>
                </div>
                <div className="card text-center p-6">
                    <div className="text-4xl font-bold text-green-400 mb-2">
                        {totalPoints}
                    </div>
                    <div className="text-sm text-[#94a3b8]">Total Points</div>
                </div>
                <div className="card text-center p-6">
                    <div className="text-4xl font-bold text-purple-400 mb-2">
                        {Math.round((unlockedCount / achievements.length) * 100)}%
                    </div>
                    <div className="text-sm text-[#94a3b8]">Completion</div>
                </div>
            </div>

            {/* Achievements List */}
            <div className="card">
                <h3 className="text-xl font-bold text-[#f1f5f9] mb-6">All Achievements</h3>
                <div className="space-y-3">
                    {achievements.map((achievement) => (
                        <AchievementBadge
                            key={achievement.id}
                            achievement={{
                                ...achievement,
                                unlockedDate: userProgress[achievement.id]?.unlockedDate
                            }}
                            unlocked={userProgress[achievement.id]?.unlocked || false}
                            progress={userProgress[achievement.id]?.progress || 0}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Helper function for level perks
const getLevelPerks = (level) => {
    const perks = [];

    if (level >= 5) perks.push('Custom profile theme');
    if (level >= 10) perks.push('Priority support');
    if (level >= 15) perks.push('Exclusive algorithms');
    if (level >= 20) perks.push('Certificate generation');
    if (level >= 25) perks.push('Mentor badge');

    return perks.length > 0 ? perks : ['Keep learning to unlock perks!'];
};

export { AchievementBadge, LevelProgress, AchievementsGrid };
