var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Company = require("../models/company");

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



// GET ALL Company Events
router.get('/api/company/:_id', function (req, res) {

    var companyID = req.params._id;

    Company.getAllEventsByCompany(companyID, function (err, company) {

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

    Company.addEvent(companyID, event, function (err, event) {

        if(err){
            res.status(404);
            res.json({success: false});
        }

        res.json({
            success: true,
            events: event.events
        });
        console.log(event);
    });
});


// UPDATE event
router.put('/api/events:_id', function (req, res) {
    let id = req.params._id;
    let updatedEvent = req.body;
    //console.log(updatedEvent);

    Event.updateUser(id, updatedEvent, {}, function (err, event) {

        if(err)
            throw err;

        res.json(event);
    });
});

// DELETE event
router.put('/api/events:_id', function (req, res) {
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
		req.flash('error_msg','You are not logged in!');
		res.redirect('/users/login');
	}
}

module.exports = router;
