var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Event = require("../models/event");
var mongoose = require('mongoose');

var path = require("path");


router.post("/", ensureAuthenticated, function(req, res){

    var type = req.body.type;
    var name = req.body.name;
    var date = req.body.date;
    var assignedTo = req.body.assignedTo;
    var user = mongoose.Types.ObjectId(req.user._id);

    const event = new Event({
        type: type,
        name: name,
        date: date,
        assignedTo: assignedTo,
        user: user
    });

    Event.addEvent(event, function (err, addedEvent) {
       console.log("event added \n" + addedEvent);

       if(err)
           req.flash("error_msg", "Cannot add event");
       else
           req.flash("success_msg", "Event added Successfully!");

        res.redirect("/uploadPrescriptions");

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
