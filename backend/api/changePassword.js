var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/', ensureAuthenticated, function(req, res) {
  res.render('changePassword');
});
router.post('/', ensureAuthenticated, function(req, res) {
  var password = req.body.password;
  var newPassword = req.body.newPassword;
  var password2 = req.body.password2;
  req.checkBody('password', ' Old Password is required').notEmpty();
  req.checkBody('newPassword', ' New Password is required').notEmpty();
  if (req.body.newPassword.length > 0) {
    req
      .checkBody('password2', 'New Password and Confirm Passwords do not match')
      .equals(req.body.newPassword);
  }
  var errors = req.validationErrors();

  if (errors) {
    res.render('changePassword', {
      errors: errors
    });
  } else {
    User.comparePassword(password, req.user.password, function(err, isMatch) {
      // Throw error if password was not matched
      if (err) throw err;

      // If it matched, return the user
      if (isMatch) {
        User.updatePassword(req.user._id, newPassword, function(err, user) {
          if (err) throw err;
          req.logout();
          res.redirect('/users/login');
        });
      } else {
        res.render('changePassword', {
          oldPassword: true
        });
      }
    });
  }
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}
module.exports = router;
