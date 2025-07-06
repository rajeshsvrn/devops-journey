// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile
} = require('../controllers/authController');
const {
    validateRegistration,
    validateLogin
} = require('../middleware/validation');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, login);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

module.exports = router;