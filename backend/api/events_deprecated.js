const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../../models/user');
const Event = require('../../models/event');

var path = require('path');

// GET Events By User ID
router.get('/user/:_id', function(req, res) {
  var userID = mongoose.Types.ObjectId(req.params._id);
  console.log(userID);
  console.log(user.id);

  Event.find({ user: userID }, function(err, events) {
    if (err) {
      res.status(404);
      res.json({ success: false });
    }

    res.json({
      success: true,
      events: events
    });
  });
});

// GET Event BY ID
router.get('/:_id', function(req, res) {
  Event.getEventByID(req.params._id, function(err, event) {
    if (err) throw err;

    res.json(event);
  });
});

// POST add event
router.post('/', function(req, res) {
  let event = req.body;

  Event.addEvent(event, function(err, event) {
    if (err) throw err;

    console.log(event);
    res.json(event);
  });
});

// UPDATE event
router.put('/:_id', function(req, res) {
  let id = req.params._id;
  let updatedEvent = req.body;
  console.log(updatedEvent);

  Event.updateUser(id, updatedEvent, {}, function(err, event) {
    if (err) throw err;

    res.json(event);
  });
});

// DELETE event
router.put('/:_id', function(req, res) {
  let id = req.params._id;

  Event.removeEvent(id, function(err, event) {
    if (err) throw err;

    res.json(event);
  });
});

module.exports = router;
