import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Model
 * 
 * Stores user account information with secure password hashing.
 * Includes preferences for personalized learning experience.
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },

    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },

    avatar: {
        type: String,
        default: null
    },

    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },

    lastLogin: {
        type: Date,
        default: null
    },

    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        animationSpeed: {
            type: Number,
            min: 0.5,
            max: 2,
            default: 1
        },
        autoPlay: {
            type: Boolean,
            default: false
        }
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
userSchema.index({ email: 1 });

/**
 * Hash password before saving
 * This middleware runs before every save operation
 */
userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Compare password for login
 * @param {string} candidatePassword - Password to check
 * @returns {Promise<boolean>} - True if password matches
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

/**
 * Get public user data (without sensitive info)
 * @returns {Object} - Safe user object
 */
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
