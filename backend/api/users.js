const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/config');
const passport = require('passport');

const router = express.Router();

const validateRegister = require('../validation/validateRegister');
const validateLogin = require('../validation/validateLogin');

// Get all users
router.get('/', (req, res) => {
  User.find((err, users) => {
    if (err) res.status(404).json({ success: false });
    console.log(users);
    res.json({ users });
  });
});

// Register POST route
router.post('/register', (req, res) => {
  // validate input
  const { errors, isValid } = validateRegister(req.body);

  // if there are errors, send errors as a response
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find user by this email
  User.findOne({ email: req.body.email }).then(user => {
    // if user with this email is available, send error as a response
    if (user && !req.body.userID) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      // create new user object
      if (!req.body.userID) {
        const newUser = new User({
          name: capitalizeFirstLetter(req.body.name.toString().toLowerCase()),
          email: req.body.email,
          password: req.body.password
        });

        // Generate a hashed password and save user into db
        User.createUser(newUser, (err, user) => {
          if (err) throw err;
          res.json({ success: true, user });
        });
      }
    }
  });
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLogin(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email })
    .populate({
      path: 'companies', // populate user companies
      populate: { path: 'events' } // populate all events for each company
    })
    .exec()
    .then(user => {
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // Check if user with the same email matches with the found user password
      bcrypt.compare(password, user.password).then(isMatch => {
        // User matched
        if (isMatch) {
          // Create JWT payload
          const payload = { user };

          // Create Token
          jwt.sign(payload, keys.secretOrKey, (err, token) => {
            if (err) throw err;

            res.json({
              success: true,
              token: 'Bearer ' + token,
              user
            });
          });
        } else {
          errors.password = 'Password incorrect';
          return res.status(404).json(errors);
        }
      });
    });
});

// Protected route

/*  @route      GET api/users/current
    @desc       Return current user
    @access     Private
 */

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = router;
