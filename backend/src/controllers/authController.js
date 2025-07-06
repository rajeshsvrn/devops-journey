// backend/src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRE
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(400).json({
                message: `User with this ${field} already exists`
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        console.log(`✅ New user registered: ${username} (${email})`);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                message: 'Validation error',
                details: messages
            });
        }

        res.status(500).json({
            message: 'Server error during registration'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username or email
        const user = await User.findByEmailOrUsername(username);

        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(400).json({
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        console.log(`✅ User logged in: ${user.username}`);

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                lastLogin: user.lastLogin
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login'
        });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            message: 'Server error fetching profile'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user.id;

        // Check if new username/email already exists (excluding current user)
        if (username || email) {
            const existingUser = await User.findOne({
                $and: [
                    { _id: { $ne: userId } },
                    {
                        $or: [
                            { username: username || '' },
                            { email: email || '' }
                        ]
                    }
                ]
            });

            if (existingUser) {
                const field = existingUser.username === username ? 'username' : 'email';
                return res.status(400).json({
                    message: `${field} is already taken`
                });
            }
        }

        // Update user
        const user = await User.findByIdAndUpdate(
            userId,
            {
                ...(username && { username }),
                ...(email && { email })
            },
            { new: true, runValidators: true }
        );

        console.log(`✅ Profile updated: ${user.username}`);

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                message: 'Validation error',
                details: messages
            });
        }

        res.status(500).json({
            message: 'Server error updating profile'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};