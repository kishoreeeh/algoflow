import { verifyToken, extractToken } from '../utils/tokenGenerator.js';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * 
 * Protects routes by verifying JWT token.
 * Attaches authenticated user to request object.
 */
export const protect = async (req, res, next) => {
    try {
        // 1. Extract token from Authorization header
        const token = extractToken(req.headers.authorization);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. No token provided.'
            });
        }

        // 2. Verify token
        const decoded = verifyToken(token);

        // 3. Find user by ID from token
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Token invalid.'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated.'
            });
        }

        // 4. Attach user to request
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message || 'Not authorized. Invalid token.'
        });
    }
};

/**
 * Role-based Authorization Middleware
 * 
 * Restricts access based on user role.
 * Must be used after protect middleware.
 * 
 * @param {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Please login.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this resource.`
            });
        }

        next();
    };
};
