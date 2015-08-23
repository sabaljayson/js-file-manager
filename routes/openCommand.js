var express = require('express');
var path = require('path');
var open = require('open');

var RoutesPaths = require('./RoutesPaths');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address')) {
		res.send('error');
	}

	open(req.query.address);

  res.send('done');

  console.log(RoutesPaths.openCommand, req.query.address);
});

module.exports = router;
