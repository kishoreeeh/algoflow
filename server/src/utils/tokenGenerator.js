import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token
 * 
 * Creates a signed JWT token for user authentication.
 * 
 * @param {Object} payload - Data to encode in token (usually userId, email, role)
 * @returns {string} - Signed JWT token
 */
export const generateToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        }
    );
};

/**
 * Verify JWT Token
 * 
 * Verifies and decodes a JWT token.
 * 
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else {
            throw new Error('Token verification failed');
        }
    }
};

/**
 * Extract token from Authorization header
 * 
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Extracted token or null
 */
export const extractToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
};
