const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock database
const users = [];

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date()
    };

    users.push(user);

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    let user = users.find(u => u.email === email);

    if (!user) {
      // Create user if doesn't exist (for demo)
      const hashedPassword = await bcrypt.hash(password, 10);
      user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        password: hashedPassword,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date()
      };
      users.push(user);
    } else {
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    // In production, verify token with Google
    // For now, create/find user
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email: `user-${Date.now()}@gmail.com`,
      name: 'Google User',
      role: 'user',
      createdAt: new Date()
    };

    const jwtToken = generateToken(user.id);

    res.json({
      message: 'Google login successful',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GitHub OAuth
router.post('/github', async (req, res) => {
  try {
    const { token } = req.body;

    // In production, verify token with GitHub
    // For now, create/find user
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email: `user-${Date.now()}@github.com`,
      name: 'GitHub User',
      role: 'user',
      createdAt: new Date()
    };

    const jwtToken = generateToken(user.id);

    res.json({
      message: 'GitHub login successful',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify token
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    res.json({ valid: true, userId: decoded.userId });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

module.exports = router;
