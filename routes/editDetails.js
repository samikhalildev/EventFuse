var express = require("express");
var router = express.Router();

var User = require("../models/user");

// Get Edit details page if user is logged on, otherwise direct them to /users/login
router.get("/", ensureAuthenticated, function(req, res) {
  res.render("editDetails", { loggedinUser: req.user});
});
router.post("/", ensureAuthenticated, function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var bio = req.body.bio;
  var specialty = req.body.specialty;

  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "Username is required").notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render("editDetails", {
      loggedinUser: req.user,

      errors: errors
    });

  } else {
    //checking for email and username are already taken
    User.getUserByNameAndId(
      req.body.username,
      req.user._id,

      function(err, user) {
        User.getUserByEmailAndId(email, req.user._id, function(err, mail) {
          if (mail) {
            res.render("editDetails", {
              mail: mail,
              loggedinUser: req.user
            });
            return;
          } else if (user) {
            res.render("editDetails", {
              userExsists: user,
              loggedinUser: req.user
            });
          } else if (user && mail) {
            res.render("editDetails", {
              mail: mail,
              userExsists: user,
              loggedinUser: req.user
            });
          } else {
            var updateUser = new User({
              name: name,
              email: email,
              username: username,
              password: password,
              bio: bio,
              specialty: specialty
            });
            User.updateUser(updateUser, req.user._id, function(err, user) {
              if (err) throw err;

              req.flash("success_msg", "You are updated");
              if (
                req.user.email !== user.email ||
                req.user.username !== user.username
              ) {
                req.logOut();
                res.redirect("/users/login");
                return;
              }

              res.render("editDetails", {
                loggedinUser: user
              });
            });
          }
        });
      }
    );
  }
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error_msg", "You are not logged in");
    res.redirect("/users/login");
  }
}

module.exports = router;
