var express = require("express");
var router = express.Router();
var User = require("../models/user");

router.get("/", ensureAuthenticated, function(req, res) {
    User.find({userType: "doctor"}, function (err, docs) {
        res.render("viewDoctors", {doctors: docs});
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
