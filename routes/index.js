var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'EventFuse - A new way to orgainse your events' });
});

module.exports = router;
