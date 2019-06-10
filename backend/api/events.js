var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Event = require('../models/event');
var auth = require('../config/auth');

/*  @route      GET api/events/
    @desc       gets post data
    @access     Public
 */

// GET An Event BY ID
router.get('/api/events/:_id', function(req, res) {
  var eventID = req.params._id;

  Event.getEvent(eventID, function(err, event) {
    if (err) throw err;

    res.json(event);
  });
});

// POST add event
router.post('/api/addEvents/:_id', function(req, res) {
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

  Event.addEvent(event, function(err, newEvent) {
    if (err) {
      res.status(404);
      res.json({ success: false });
    }

    Company.addEventToCompany(companyID, newEvent._id, function(err, doc) {
      if (err) throw err;
    });

    res.json({
      success: true,
      events: newEvent
    });
  });
});

module.exports = router;
