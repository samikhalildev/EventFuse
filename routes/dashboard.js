var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Company = require("../models/company");
var Event = require("../models/event");

const mongoose = require('mongoose');

var path = require("path");


router.get("/", ensureAuthenticated, function(req, res) {

    Company.getAllUserCompanies(user.username, function (err, companies) {

        if(err){
            return console.log("error");
        }

        res.render("dashboard", {companies: companies});

    });
});


router.get("/update/:_id", ensureAuthenticated, function (req, res) {
    var id = req.params._id;
    console.log(id);

    Event.getEvent(id, function (err, event) {

        if(err)
            return console.log("error " + err);

        console.log(event[0]);
    });
});

router.get("/delete/:_id", ensureAuthenticated, function (req, res) {

});


// GET ALL Company Events
router.get('/api/company/:_id', function (req, res) {

    var query = {company: req.params._id};

    Event.find(query)
        .populate("company")
        .exec()
        .then(docs => {

            res.json({
                success: true,
                events: docs[0].events,
                company: docs[0].company
            });

        })
        .catch(err => {
            res.status(404);
            res.json({success: false});
            console.log(err);
        });
});



// GET Company team
router.get('/api/company/team/:_id', function (req, res) {

    var companyID = req.params._id;

    Company.getCompanyById(companyID, function (err, company) {

        if(err){
            res.status(404);
            res.json({success: false});
        }

        res.json({
            success: true,
            company: company
        });

    });
});

// GET An Event BY ID
router.get('/api/events/:_id', function (req, res) {

    var eventID = req.params._id;

    Company.getEvent(eventID, function (err, event) {

        if(err)
            throw err;

        res.json(event);
    });
});

// POST add event
router.post('/api/addEvents/:_id', function (req, res) {
    let event = req.body;
    let companyID = req.params._id;

    Event.addEvent(companyID, event, function (err, newEvent) {

        if(err){
            res.status(404);
            res.json({success: false});
        }

        res.json({
            success: true,
            events: newEvent
        });
        console.log(newEvent);
    });
});


// DELETE event
router.delete('/api/events:_id', function (req, res) {
    let id = req.params._id;

    Event.removeEvent(id, function (err, event) {

        if(err)
            throw err;

        res.json(event);
    });
});




function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in 🔑');
		res.redirect('/users/login');
	}
}

module.exports = router;
