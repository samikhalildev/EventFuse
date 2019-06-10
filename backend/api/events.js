var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Event = require('../models/event');
var auth = require('../config/auth');
var validateEvent = require('../validation/validateEvent');

/*  @route      POST api/events/:_id
    @desc       Add an event, pass company id in parameter
    @access     Private
 */
router.post('/:_id', auth, (req, res) => {
  const { errors, isValid } = validateEvent(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Event.create(req.body)
    .then(newEvent => {
      var query = { _id: req.params._id };
      Company.findOneAndUpdate(query, { $push: { events: newEvent._id } })
        .populate('events')
        .then(company => {
          company.events.push(newEvent);
          res.json({ success: true, company });
        })
        .catch(err => {
          res.status(400).json({ success: false });
        });
    })
    .catch(err => {
      res.status(400).json({ success: false });
    });
});

/*  @route      PUT api/events/:_id
    @desc       Update an event, pass event id in parameter
    @access     Private
 */
router.put('/:_id', auth, function(req, res) {
  const { errors, isValid } = validateEvent(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  var query = { _id: req.params._id };

  var updateEvent = {
    $set: {
      type: req.body.type,
      name: req.body.name,
      date: req.body.date,
      status: req.body.status,
      storage: req.body.storage,
      notes: req.body.notes,
      assignedTo: req.body.assignedTo
    }
  };

  Event.findOneAndUpdate(query, updateEvent)
    .then(event => {
      console.log(event);
      res.json({ success: true, event });
    })
    .catch(err => {
      res.status(400).json({ success: false });
    });
});

/*  @route      DELETE api/events/:_id
    @desc       Delete an event, pass event id in parameter
    @access     Private
 */
router.delete('/:_id', function(req, res) {
  var query = { _id: req.params._id };
  Event.remove(query)
    .then(event => {
      console.log(event);
      res.json({ success: true, event });
    })
    .catch(err => {
      res.status(400).json({ success: false });
    });
});

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

module.exports = router;
