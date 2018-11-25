var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/user");


// GET Rregister page
router.get("/register", function(req, res) {
  res.render("register");
});


// GET login page
router.get("/login", function(req, res) {
  res.render("login");
});


// Register User
router.post("/register", function(req, res) {
  // Get the data from the register form
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody("firstname", "First name is too short.").isLength({min: 3});
  req.checkBody("firstname", "First name must contain letters only.").isAlpha();

  req.checkBody("lastname", "Last name is too short.").isLength({min: 3});
  req.checkBody("lastname", "Last name must contain letters only.").isAlpha();

  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "Username is too short.").isLength({min: 3});

  req.checkBody("password", "Password must be atleast 6 characters.").isLength({min: 6});
  req.checkBody("password2", "Password does not match.").equals(password);

  var errors = req.validationErrors();

  if (errors) {
      res.render("register", { error_msg: errors, firstname: firstname, lastname: lastname, email: email, username: username });

  } else {
    //checking for email and username are already taken
    User.findOne(
      {
        username: {
          $regex: "^" + username + "\\b",
          $options: "i"
        }
      },
      function(err, user) {
        User.findOne(
          {
            email: {
              $regex: "^" + email + "\\b",
              $options: "i"
            }
          },
          function(err, mail) {
            if (user || mail) {
              res.render("register", {
                user: user
              });
            } else {

                // Creates a new user object
              var newUser = new User({
                  firstname: firstname,
                  lastname: lastname,
                  email: email,
                  username: username,
                  password: password
              });

              User.createUser(newUser, function(err, user) {
                if (err) throw err;
              });

              req.flash("success_msg", "You can now login!");
              res.redirect("/users/login");
            }
          }
        );
      }
    );
  }
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      // Throw error if username was incorrect
      if (err) throw err;
      if (!user) {
          return done(null, false, { message: "Unknown User" });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        // Throw error if password was not matched
        if (err) throw err;

        // If it matched, return the user
        if (isMatch) {
            return done(null, user);
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
  }),
  function(req, res) {
    req.flash("error_msg", "Invalid username or password.");
    res.redirect("/users/login");
  }
);

router.get("/logout", function(req, res) {
  req.logout();

  req.flash("success_msg", "You have logged out.");
  res.redirect("/users/login");
});

module.exports = router;
