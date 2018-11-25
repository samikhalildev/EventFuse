var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Event = require("../models/event");
const mongoose = require('mongoose');

var path = require("path");


router.get("/", ensureAuthenticated, function(req, res) {
    res.render("index");
});


// GET Events By User ID
router.get('/api/events/users/:_id', function (req, res) {

    var userID = req.params._id;
    console.log(userID);

    Event.find({user: userID}, function (err, events) {

        if(err){
            res.status(404);
            res.json({success: false});
        }

        res.json({
            success: true,
            events: events
        });
    });
});


// GET Event BY ID
router.get('/api/events/:_id', function (req, res) {
    Event.getEventByID(req.params._id, function (err, event) {

        if(err)
            throw err;

        res.json(event);
    });
});

// POST add event
router.post('/api/events', function (req, res) {
    let event = req.body;

    Event.addEvent(event, function (err, event) {

        if(err)
            throw err;

        console.log(event);
        res.json(event);
    });
});

// UPDATE event
router.put('/api/events:_id', function (req, res) {
    let id = req.params._id;
    let updatedEvent = req.body;
    console.log(updatedEvent);

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
