require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();

// Needed so secure cookies work behind Render's proxy
app.set('trust proxy', 1);

// Allowed frontend addresses
const allowedOrigins = [
    'http://localhost:5173',
    'https://incandescent-eclair-dd06ab.netlify.app'
];

// CORS configuration
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// CSRF Protection using Origin validation
app.use((req, res, next) => {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

    if (safeMethods.includes(req.method)) {
        return next();
    }

    const origin = req.get('Origin');

    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({
            success: false,
            message: 'CSRF validation failed'
        });
    }

    next();
});

// Security middleware
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());

// Other middleware
app.use(express.json());
app.use(logger);

// Home route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'TechFest API running securely'
    });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));

// Error handling
app.use(notFound);
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });