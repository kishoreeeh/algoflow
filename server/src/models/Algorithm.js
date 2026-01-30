import mongoose from 'mongoose';

/**
 * Algorithm Model
 * 
 * Stores algorithm metadata, concept explanations, and complexity information.
 * This is used for the algorithm catalog and metadata display.
 */
const algorithmSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        enum: ['sorting', 'searching', 'tree', 'graph', 'dp', 'stack', 'queue', 'linkedlist'],
        index: true
    },

    difficulty: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced'],
        index: true
    },

    description: {
        type: String,
        required: true,
        maxlength: 500
    },

    concept: {
        analogy: {
            type: String,
            required: true
        },
        keyIdea: {
            type: String,
            required: true
        },
        whenToUse: {
            type: String,
            required: true
        },
        realWorldExample: {
            type: String,
            default: ''
        }
    },

    complexity: {
        time: {
            best: {
                type: String,
                required: true
            },
            average: {
                type: String,
                required: true
            },
            worst: {
                type: String,
                required: true
            }
        },
        space: {
            type: String,
            required: true
        }
    },

    prerequisites: [{
        type: String // Array of algorithm IDs
    }],

    estimatedTime: {
        type: Number, // in minutes
        required: true,
        min: 1
    },

    totalSteps: {
        type: Number,
        required: true,
        min: 1
    },

    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],

    isActive: {
        type: Boolean,
        default: true
    },

    icon: {
        type: String,
        default: '🎯'
    },

    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for faster queries
algorithmSchema.index({ category: 1, difficulty: 1 });
algorithmSchema.index({ isActive: 1 });
algorithmSchema.index({ tags: 1 });

/**
 * Get algorithms by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} - Array of algorithms
 */
algorithmSchema.statics.findByCategory = function (category) {
    return this.find({ category, isActive: true }).sort({ order: 1 });
};

/**
 * Get algorithms by difficulty
 * @param {string} difficulty - Difficulty level
 * @returns {Promise<Array>} - Array of algorithms
 */
algorithmSchema.statics.findByDifficulty = function (difficulty) {
    return this.find({ difficulty, isActive: true }).sort({ order: 1 });
};

/**
 * Search algorithms by name or tags
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of matching algorithms
 */
algorithmSchema.statics.search = function (query) {
    const searchRegex = new RegExp(query, 'i');
    return this.find({
        isActive: true,
        $or: [
            { name: searchRegex },
            { description: searchRegex },
            { tags: searchRegex }
        ]
    }).sort({ order: 1 });
};

const Algorithm = mongoose.model('Algorithm', algorithmSchema);

export default Algorithm;
