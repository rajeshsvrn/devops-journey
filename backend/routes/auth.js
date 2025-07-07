const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: 'User exists' });

  const newUser = new User({ username, password });
  await newUser.save();
  res.json({ message: 'Registered successfully' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || user.password !== password)
    return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ message: 'Login successful' });
});

module.exports = router;