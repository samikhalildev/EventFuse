var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Prescription = require("../models/prescription");

router.get("/", ensureAuthenticated, function(req, res) {

    // stores the studentID so we can then check in the prescription DB to see if that student has any prescriptions.
    var studentid = user._id.toString();

    // we pass in the studentID as a string and query the DB to find the prescriptions.
    Prescription.find({studentid: studentid}, function (err, prescriptions) {
        res.render("viewPrescriptions", {prescriptions: prescriptions});
        console.log(prescriptions.doctor);
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
