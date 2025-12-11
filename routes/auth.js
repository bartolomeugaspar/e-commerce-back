const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { supabase, supabaseAdmin } = require('../lib/supabase');

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

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Create user profile in database
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          role: 'user'
        }
      ])
      .select();

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    // Generate JWT token
    const token = generateToken(authData.user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: name,
        role: 'user'
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

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      // User doesn't exist, create one (for demo)
      const { data: newAuthData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: email.split('@')[0] }
      });

      if (createError) {
        return res.status(400).json({ error: createError.message });
      }

      // Create user profile
      const { data: profileData } = await supabase
        .from('users')
        .insert([
          {
            id: newAuthData.user.id,
            email,
            name: email.split('@')[0],
            role: isAdmin ? 'admin' : 'user'
          }
        ])
        .select();

      const token = generateToken(newAuthData.user.id);

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: newAuthData.user.id,
          email: newAuthData.user.email,
          name: email.split('@')[0],
          role: isAdmin ? 'admin' : 'user'
        }
      });
    }

    // Get user profile
    const { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    const token = generateToken(authData.user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: profileData?.name || email.split('@')[0],
        role: profileData?.role || 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { email, name } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    let user = existingUser;

    if (!user) {
      // Create new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([
          {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: name || email.split('@')[0],
            role: 'user'
          }
        ])
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      user = newUser;
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Google login successful',
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

// GitHub OAuth
router.post('/github', async (req, res) => {
  try {
    const { email, name } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    let user = existingUser;

    if (!user) {
      // Create new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([
          {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: name || email.split('@')[0],
            role: 'user'
          }
        ])
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      user = newUser;
    }

    const token = generateToken(user.id);

    res.json({
      message: 'GitHub login successful',
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
