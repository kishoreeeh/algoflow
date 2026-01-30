import Progress from '../models/Progress.js';

/**
 * @desc    Create or update progress for an algorithm
 * @route   POST /api/progress/update
 * @access  Private
 */
export const updateProgress = async (req, res, next) => {
    try {
        const { algorithmId, status, currentStep, totalSteps } = req.body;
        const userId = req.user._id;

        let progress = await Progress.findOne({ userId, algorithmId });

        if (!progress) {
            progress = await Progress.create({
                userId,
                algorithmId,
                status,
                currentStep: currentStep || 0,
                totalSteps
            });
        } else {
            // Update status whenever requested (allows re-learning from completed -> in_progress)
            progress.status = status;

            if (currentStep !== undefined) progress.currentStep = currentStep;
            if (totalSteps !== undefined) progress.totalSteps = totalSteps;

            if (status === 'completed') {
                progress.completedAt = new Date();
                progress.currentStep = totalSteps;
            }

            progress.lastWatched = new Date(); // Update timestamp on every interaction
            await progress.save();
        }

        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user's progress for all algorithms
 * @route   GET /api/progress
 * @access  Private
 */
export const getAllProgress = async (req, res, next) => {
    try {
        const userId = req.user._id;
        // Sort by lastWatched descending so latest is at index 0
        const progressList = await Progress.find({ userId }).sort({ lastWatched: -1 });

        res.status(200).json({
            success: true,
            data: progressList
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete progress for an algorithm
 * @route   DELETE /api/progress/:algorithmId
 * @access  Private
 */
export const deleteProgress = async (req, res, next) => {
    try {
        const { algorithmId } = req.params;
        const userId = req.user._id;

        await Progress.findOneAndDelete({ userId, algorithmId });

        res.status(200).json({
            success: true,
            message: 'Progress deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
