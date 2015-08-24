var express = require('express');
var path = require('path');
var open = require('open');

var RoutesPaths = require('./RoutesPaths');
var response = require('../utils/response');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address')) {
		return response(res).fail('open, Invalid arguments');
	}

	try {
		open(req.query.address);
	}
	catch (e) {
		return response(res).fail(e);
	}

  console.log(RoutesPaths.openCommand, req.query.address);
  return response(res).success();
});

module.exports = router;
