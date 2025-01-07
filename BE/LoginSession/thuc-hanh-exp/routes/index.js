var express = require('express');
const { sessionChecker } = require('../middleware/middlewareController');
var router = express.Router();

/* GET home page. */
router.get('/',sessionChecker, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
