
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');

// Validation middleware
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    next();
};

// SIGNUP
router.post(
    '/signup',
    [
        body('name').trim().notEmpty().withMessage('Name required'),
        body('email').trim().isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 8 }).withMessage('Password must contain at least 8 characters')
    ],
    validateRequest,
    async (req, res, next) => {
        try {
            const { name, email, phone, password } = req.body;

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already used'
                });
            }

            const hashed = await bcrypt.hash(password, 10);

            await User.create({
                name,
                email,
                phone,
                password: hashed,
                role: 'user'
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully'
            });

        } catch (e) {
            next(e);
        }
    }
);

// LOGIN
router.post(
    '/login',
    [
        body('email').trim().isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password required')
    ],
    validateRequest,
    async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Secure HTTP-only cookie
            const sameSite = process.env.COOKIE_SAME_SITE || 'strict';

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: sameSite,
                maxAge: 60 * 60 * 1000
            });

            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    name: user.name,
                    role: user.role
                }
            });

        } catch (e) {
            next(e);
        }
    }
);

// LOGOUT
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.COOKIE_SAME_SITE || 'strict',
        path: '/'
    });

    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;
