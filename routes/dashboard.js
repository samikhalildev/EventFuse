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


// GET ALL Company Events
router.get('/api/company/:_id', function (req, res) {

    var query = {_id: req.params._id};

    Company.findOne(query)
        .populate("events")
        .exec()
        .then(docs => {

            res.json({
                success: true,
                company: docs
            });

            //console.log(docs);

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

    Event.getEvent(eventID, function (err, event) {

        if(err)
            throw err;

        res.json(event);
    });
});

// POST add event
router.post('/api/addEvents/:_id', function (req, res) {
    let companyID = req.params._id;

    var event = new Event({
        type: req.body.type,
        name: req.body.name,
        date: req.body.date,
        status: req.body.status,
        storage: req.body.storage,
        price: req.body.price,
        notes: req.body.notes,
        assignedTo: req.body.assignedTo
    });

    Event.addEvent(event, function (err, newEvent) {

        if(err){
            res.status(404);
            res.json({success: false});
        }

        Company.addEventToCompany(companyID, newEvent._id, function (err, doc) {

            if(err)
                throw err;

        });

        res.json({
            success: true,
            events: newEvent
        });

        //console.log(newEvent);
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
