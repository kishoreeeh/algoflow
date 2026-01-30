import express from 'express';
import {
    register,
    login,
    getMe,
    updatePreferences,
    logout
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * Authentication Routes
 */

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/preferences', protect, updatePreferences);
router.post('/logout', protect, logout);

export default router;
