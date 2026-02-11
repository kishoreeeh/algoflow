const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');
const User = require('../models/User');

/**
 * @route   GET /api/analytics/activity
 * @desc    Get user activity data for streak calendar
 * @access  Private
 */
router.get('/activity', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get activity data for last 365 days
        const oneYearAgo = new Date();
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);

        const activities = await Progress.aggregate([
            {
                $match: {
                    userId: userId,
                    lastWatched: { $gte: oneYearAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$lastWatched' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    count: 1
                }
            },
            { $sort: { date: 1 } }
        ]);

        // Calculate streaks
        const { currentStreak, longestStreak } = calculateStreaks(activities);

        res.json({
            success: true,
            activity: activities,
            currentStreak,
            longestStreak
        });
    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching activity data'
        });
    }
});

/**
 * @route   GET /api/analytics/progress
 * @desc    Get user progress statistics
 * @access  Private
 */
router.get('/progress', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all progress records
        const progressRecords = await Progress.find({ userId });

        // Calculate statistics
        const algorithmsCompleted = progressRecords.filter(p => p.status === 'completed').length;
        const totalAlgorithms = 50; // Update based on your algorithm count

        const totalTimeSpent = progressRecords.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

        const scores = progressRecords.filter(p => p.score).map(p => p.score);
        const averageScore = scores.length > 0
            ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
            : 0;

        // Category progress
        const categoryProgress = await Progress.aggregate([
            { $match: { userId: userId } },
            {
                $lookup: {
                    from: 'algorithms',
                    localField: 'algorithmId',
                    foreignField: 'id',
                    as: 'algorithm'
                }
            },
            { $unwind: '$algorithm' },
            {
                $group: {
                    _id: '$algorithm.category',
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    completed: 1,
                    total: 1,
                    percentage: {
                        $multiply: [{ $divide: ['$completed', '$total'] }, 100]
                    }
                }
            }
        ]);

        res.json({
            success: true,
            algorithmsCompleted,
            totalAlgorithms,
            timeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
            averageScore,
            categoryProgress
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching progress data'
        });
    }
});

/**
 * @route   GET /api/analytics/mastery
 * @desc    Get mastery levels for algorithms
 * @access  Private
 */
router.get('/mastery', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        const masteryData = await Progress.aggregate([
            { $match: { userId: userId, status: 'completed' } },
            {
                $lookup: {
                    from: 'algorithms',
                    localField: 'algorithmId',
                    foreignField: 'id',
                    as: 'algorithm'
                }
            },
            { $unwind: '$algorithm' },
            {
                $project: {
                    algorithm: '$algorithm.name',
                    score: 1,
                    attempts: 1,
                    level: {
                        $switch: {
                            branches: [
                                { case: { $gte: ['$score', 90] }, then: 'Expert' },
                                { case: { $gte: ['$score', 75] }, then: 'Advanced' },
                                { case: { $gte: ['$score', 60] }, then: 'Intermediate' }
                            ],
                            default: 'Beginner'
                        }
                    }
                }
            },
            { $sort: { score: -1 } }
        ]);

        res.json({
            success: true,
            mastery: masteryData
        });
    } catch (error) {
        console.error('Error fetching mastery:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching mastery data'
        });
    }
});

/**
 * @route   POST /api/analytics/track
 * @desc    Track user activity
 * @access  Private
 */
router.post('/track', protect, async (req, res) => {
    try {
        const { algorithmId, action, timeSpent } = req.body;
        const userId = req.user.id;

        // Update or create progress record
        let progress = await Progress.findOne({ userId, algorithmId });

        if (!progress) {
            progress = new Progress({
                userId,
                algorithmId,
                status: 'in_progress',
                lastWatched: new Date(),
                timeSpent: timeSpent || 0
            });
        } else {
            progress.lastWatched = new Date();
            progress.timeSpent = (progress.timeSpent || 0) + (timeSpent || 0);
        }

        await progress.save();

        res.json({
            success: true,
            message: 'Activity tracked successfully'
        });
    } catch (error) {
        console.error('Error tracking activity:', error);
        res.status(500).json({
            success: false,
            message: 'Error tracking activity'
        });
    }
});

// Helper function to calculate streaks
function calculateStreaks(activities) {
    if (activities.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    const dates = activities.map(a => new Date(a.date)).sort((a, b) => b - a);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate current streak
    if (dates[0].getTime() === today.getTime() ||
        dates[0].getTime() === today.getTime() - 86400000) {
        currentStreak = 1;

        for (let i = 1; i < dates.length; i++) {
            const diff = dates[i - 1].getTime() - dates[i].getTime();
            if (diff === 86400000) { // 1 day in milliseconds
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Calculate longest streak
    for (let i = 1; i < dates.length; i++) {
        const diff = dates[i - 1].getTime() - dates[i].getTime();
        if (diff === 86400000) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 1;
        }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    return { currentStreak, longestStreak };
}

module.exports = router;
