import User from '../models/User.js';
import { generateToken } from '../utils/tokenGenerator.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, password, and name'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            name
        });

        // Generate token
        const token = generateToken({
            userId: user._id,
            email: user.email,
            role: user.role
        });

        // Send response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    preferences: user.preferences
                },
                token
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Verify password
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken({
            userId: user._id,
            email: user.email,
            role: user.role
        });

        // Send response (exclude password)
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    preferences: user.preferences,
                    lastLogin: user.lastLogin
                },
                token
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    preferences: user.preferences,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user preferences
 * @route   PUT /api/auth/preferences
 * @access  Private
 */
export const updatePreferences = async (req, res, next) => {
    try {
        const { theme, animationSpeed, autoPlay } = req.body;

        const user = await User.findById(req.user._id);

        if (theme) user.preferences.theme = theme;
        if (animationSpeed !== undefined) user.preferences.animationSpeed = animationSpeed;
        if (autoPlay !== undefined) user.preferences.autoPlay = autoPlay;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Preferences updated successfully',
            data: {
                preferences: user.preferences
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
    try {
        // In a stateless JWT system, logout is handled client-side
        // This endpoint is mainly for logging purposes

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        next(error);
    }
};
