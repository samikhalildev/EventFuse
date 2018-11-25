var express = require("express");
var router = express.Router();

// Get Edit details page if user is logged on, otherwise direct them to /users/login
router.get("/", ensureAuthenticated, function(req, res) {
    res.render("contactus", { loggedinUser: req.user });
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
