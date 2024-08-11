const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { secretOrKey } = require('./config');
const authMiddleware = require('./middleware/authMiddleware'); // Import the middleware

const router = express.Router();

// @route   POST /api/register
// @desc    Register new user
// @access  Public
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ email })
    .then(user => {
      if (user) return res.status(400).json({ msg: 'User already exists' });

      const newUser = new User({
        name,
        email,
        password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;

        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
              // Create JWT payload
              const payload = { id: user.id, name: user.name, email: user.email };

              // Sign token
              jwt.sign(
                payload,
                secretOrKey,
                { expiresIn: 3600 },  // Token expires in 1 hour
                (err, token) => {
                  if (err) throw err;
                  res.json({
                    success: true,
                    token: `Bearer ${token}`,
                    user: {
                      id: user.id,
                      name: user.name,
                      email: user.email
                    }
                  });
                }
              );
            })
            .catch(err => res.status(500).json({ msg: 'Error saving the user', error: err.message }));
        });
      });
    })
    .catch(err => res.status(500).json({ msg: 'Error checking for existing user', error: err.message }));
});

// @route   POST /api/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(400).json({ msg: 'User does not exist' });

      // Validate password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

          // Create JWT payload
          const payload = { id: user.id, name: user.name, email: user.email };

          // Sign token
          jwt.sign(
            payload,
            secretOrKey,
            { expiresIn: 3600 },  // Token expires in 1 hour
            (err, token) => {
              if (err) throw err;
              res.json({
                success: true,
                token: `Bearer ${token}`,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email
                }
              });
            }
          );
        })
        .catch(err => res.status(500).json({ msg: 'Error comparing passwords', error: err.message }));
    })
    .catch(err => res.status(500).json({ msg: 'Error checking for existing user', error: err.message }));
});

// @route   GET /api/dashboard
// @desc    Access protected route
// @access  Private
router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({
    success: true,
    msg: 'Welcome to the dashboard!',
    user: req.user
  });
});

module.exports = router;
