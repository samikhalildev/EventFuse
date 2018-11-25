var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Prescription = require("../models/prescription");

var path = require("path");


router.get("/", ensureAuthenticated, function(req, res) {
    User.find({userType: "student"}, function (err, patients) {
        res.render("uploadPrescriptions", {patient: patients});
    });
});

router.post("/", ensureAuthenticated, function(req, res){

    // store the studentID
    var id = req.body.studentID.toString();

    // store the doctor username
    var doctor = user.username;

    // store the prescription
    var description = req.body.prescription;

    // DB query to find the object based on the student ID
    User.getUserById(id, function(err, student) {

        console.log("Doctor: " + doctor + "\nDescription: " + description);

        // create a new prescription object
        var newPrescription = new Prescription({
            studentid: id,
            doctor: doctor,
            description: description
        });

        // add the prescription to the database
        Prescription.AddPrescription(newPrescription, function(err, prescription){
           if(err)
               req.flash("error_msgg", "Upload failed, please try again.");
           else {
               req.flash("success_msg", "Upload Success!");
               console.log(prescription);
           }
            res.redirect("/uploadPrescriptions");
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
