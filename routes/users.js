var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/user");
var Company = require("../models/company");

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

    // for invite
  var userID = req.body.userID;

  // Get the data from the register form
  var name = req.body.name;
  var email = userID ? req.body.userEmail : req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody("name", "First name is too short.").isLength({min: 3});
  req.checkBody("name", "First name must contain letters only.").isAlpha();

  if(!userID)
      req.checkBody("email", "Email is not valid.").isEmail();

  req.checkBody("username", "Username is too short.").isLength({min: 3});

  req.checkBody("password", "Password must be atleast 6 characters.").isLength({min: 6});
  req.checkBody("password2", "Passwords don't match.").equals(password);

  var errors = req.validationErrors();

  if (errors) {

      if(userID)
          res.render("register", {error_msg: errors, name: name, userEmail: email, username: username, userID: userID});
      else
        res.render("register", { error_msg: errors, name: name, email: email, username: username });

  } else {
    //checking if email and username are already taken
    User.findOne({username: {$regex: "^" + username + "\\b", $options: "i"}}, function(err, usernameTaken) {

        var error = [];

        if(usernameTaken)
            error.push("Username is taken");

        User.findOne({email: {$regex: "^" + email + "\\b", $options: "i"}}, function(err, emailTaken) {

            if (emailTaken && !userID)
                error.push("Email is taken");

            if(usernameTaken || (emailTaken && !userID)){

                if(userID)
                    res.render("register", {name: name, userEmail: email, username: username, userID: userID, error: error});
                else
                    res.render("register", {name: name, email: email, username: username, error: error});

            } else {

                let _name = capitalizeFirstLetter(name.toString().toLowerCase());

                // Creates a new user object
                var newUser = new User({
                    _id: userID,
                    name: _name,
                    email: email,
                    username: username,
                    password: password
                });

                if(!userID){
                  User.createUser(newUser, function(err, user) {

                      if (err)
                          throw err;

                      console.log("User created:\n" + user);
                  });

                } else {

                  User.userRegistration_invite(newUser, userID, function (err, user) {

                      if(err)
                         throw err;

                     Company.updateUserDetails(newUser, function (err, company) {

                         if(err)
                            throw err;

                     });
                      console.log("User created:\n" + user);
                  });
                }

                req.flash("success_msg", "You can now login 😬");
                res.redirect("/users/login");
            }
        });
      }
    );
  }
});


passport.use(new LocalStrategy(function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            // Throw error if username was incorrect
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: "Unknown username 😱" });
            }

            User.comparePassword(password, user.password, function(err, isMatch) {
                // Throw error if password was not matched
                if (err) throw err;

                // If it matched, return the user
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Invalid password 😰" });
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

router.get("/invite/:_id", function(req, res) {

    if (user) {
        return res.redirect("/");
    }

    var userID = req.params._id;

    User.getUserById(userID, function (err, user) {

        if(!user)
            return res.redirect("/");

        if(!user.username)
            res.render("register", { userID: userID, userEmail: user.email });
        else
            res.render("login", { success_msg: "You are already registerd " + user.name + "! Please login 😄" });
    });
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    }), function(req, res) {
        res.redirect("/");
    }
);

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success_msg", "You are logged out ✋");
    res.redirect("/users/login");
});


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = router;
