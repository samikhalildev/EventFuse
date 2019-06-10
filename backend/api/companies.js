var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var User = require('../models/user');
var auth = require('../config/auth');

/*  @route      GET api/companies/
    @desc       Return all companies by user id in auth
    @access     Private
 */
router.get('/', auth, (req, res) => {
  var query = {
    'team._id': req.user.id
  };

  Company.find(query)
    .populate('events')
    .exec()
    .then(companies => {
      //console.log('Output: companies', companies);
      res.json({ success: true, companies });
    })
    .catch(err => {
      console.log('Output: err', err);
      res
        .status(404)
        .json({ success: false, msg: 'User does not have any companies' });
    });
});

/*  @route      POST api/companies/
    @desc       Add a new company
    @access     Private
 */
router.post('/', auth, (req, res) => {
  var newCompany = new Company({
    name: req.body.name,
    team: {
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      isOwner: true,
      isAdmin: true
    }
  });

  Company.create(newCompany)
    .then(company => {
      var query = { _id: req.user.id };
      console.log(company);

      User.findOneAndUpdate(query, { $push: { companies: company._id } })
        .populate({
          path: 'companies',
          populate: { path: 'events' }
        })
        .exec()
        .then(user => {
          user.companies.push(company);
          res.json({ success: true, companies: user.companies });
        })
        .catch(err => {
          console.log('An error occured:', err);
          res.status(401).json({ success: false });
        });
    })
    .catch(err => {
      console.log('An error occured:', err);
      res.status(401).json({ success: false });
    });
});

/*  @route      GET api/companies/events/:id
    @desc       Return all events for a company
    @access     Private
 */
router.get('/events/:_id', auth, function(req, res) {
  var query = { _id: req.params._id };

  Company.findOne(query)
    .populate('events')
    .exec()
    .then(docs => {
      console.log(docs);
      res.json({
        success: true,
        company: docs
      });
    })
    .catch(err => {
      res.status(404);
      res.json({ success: false });
      console.log(err);
    });
});

/*  @route      GET api/companies/team/:id
    @desc       Return team for a company
    @access     Private
 */
router.get('/team/:_id', auth, function(req, res) {
  var companyID = req.params._id;

  Company.getCompanyById(companyID, function(err, company) {
    if (err) {
      res.status(404);
      res.json({ success: false });
    }

    res.json({
      success: true,
      company: company
    });
  });
});

module.exports = router;
