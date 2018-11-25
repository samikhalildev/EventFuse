var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var User = require("../models/user");

// Get Edit details page if user is logged on, otherwise direct them to /users/login
router.get("/", ensureAuthenticated, function(req, res) {
    res.render("profile");
});

// ID Parameter URL
router.get("/:id", ensureAuthenticated, function(req, res) {
    var id = req.params.id;
    var doctor;

    // DB query to find the object based on the URL ID
    // returns the user and injects it into the html to display the profile page
    User.getUserById(id, function(err, doctor) {
        console.log(doctor);
        res.render("profile", {
            user: doctor,
        });
    });
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
