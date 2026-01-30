import mongoose from 'mongoose';

/**
 * Progress Model
 * 
 * Tracks user progress for each algorithm.
 * Stores completion status, time spent, and current position.
 */
const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    algorithmId: {
        type: String,
        required: true,
        index: true
    },

    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started'
    },

    currentStep: {
        type: Number,
        default: 0,
        min: 0
    },

    totalSteps: {
        type: Number,
        required: true,
        min: 1
    },

    timeSpent: {
        type: Number, // in seconds
        default: 0,
        min: 0
    },

    lastWatched: {
        type: Date,
        default: Date.now
    },

    completedAt: {
        type: Date,
        default: null
    },

    attempts: {
        type: Number,
        default: 0,
        min: 0
    },

    score: {
        type: Number,
        default: null,
        min: 0,
        max: 100
    },

    notes: {
        type: String,
        default: '',
        maxlength: 1000
    },

    bookmarkedSteps: [{
        type: Number
    }]
}, {
    timestamps: true
});

// Compound index for faster queries
progressSchema.index({ userId: 1, algorithmId: 1 }, { unique: true });

/**
 * Calculate progress percentage
 * @returns {number} - Progress percentage (0-100)
 */
progressSchema.methods.getProgressPercentage = function () {
    if (this.totalSteps === 0) return 0;
    return Math.round((this.currentStep / this.totalSteps) * 100);
};

/**
 * Mark as completed
 */
progressSchema.methods.markCompleted = function () {
    this.status = 'completed';
    this.completedAt = new Date();
    this.currentStep = this.totalSteps;
};

/**
 * Update time spent
 * @param {number} seconds - Seconds to add
 */
progressSchema.methods.addTimeSpent = function (seconds) {
    this.timeSpent += seconds;
    this.lastWatched = new Date();
};

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
