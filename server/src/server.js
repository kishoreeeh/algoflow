import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// CORS configuration - Allow all origins
app.use(cors({
    origin: '*', // Allow all origins
    credentials: false, // Set to false when using wildcard origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to DSA Learning Platform API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            algorithms: '/api/algorithms (coming soon)',
            progress: '/api/progress (coming soon)'
        }
    });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ============================================');
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);
    console.log(`🚀 Server listening on port ${PORT}`);
    console.log(`🚀 API URL: http://localhost:${PORT}`);
    console.log(`🚀 Client URL: ${process.env.CLIENT_URL}`);
    console.log('🚀 ============================================');
    console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

export default app;
